package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"sort"
	"strconv"

	"github.com/maxcanna/bicineabbiamo/internal/model"
)

const (
	urbansharingURL = "https://core.urbansharing.com/public/api/v1/graphql"
	systemID        = "milan-bikemi"
)

var (
	numberPrefixRegex = regexp.MustCompile(`^\d* `)
	dashPrefixRegex   = regexp.MustCompile(`^.*?- `)
)

var (
	bikeTypes = map[string]string{
		"bike":                 "NORMAL",
		"ebike":                "ELECTRIC",
		"ebike_with_childseat": "CHILD_SEAT",
	}
	bikeNames = map[string]string{
		"bike":                 "Biciclette",
		"ebike":                "Biciclette elettriche",
		"ebike_with_childseat": "Biciclette elettriche con seggiolino",
	}
)

type StationService interface {
	GetStations(ctx context.Context, params GetStationsParams) ([]model.Station, error)
}

type GetStationsParams struct {
	OnlyActive      bool
	OnlyWithBikes   bool
	OnlyWithParking bool
	Latitude        float64
	Longitude       float64
	OnlyFirstResult bool
}

type stationService struct {
	client *http.Client
}

func NewStationService() StationService {
	return &stationService{
		client: &http.Client{},
	}
}

func (s *stationService) GetStations(ctx context.Context, params GetStationsParams) ([]model.Station, error) {
	reqURL, err := url.Parse(urbansharingURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse url: %w", err)
	}

	extensionsJSON := `{"persistedQuery":{"version":1,"sha256Hash":"5227472abbe6028dedd30341e94363da729bebc4f4ee366ffade3e39e01efd10"}}`
	q := reqURL.Query()
	q.Set("extensions", extensionsJSON)
	q.Set("operationName", "stationMapQuery")
	reqURL.RawQuery = q.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("systemid", systemID)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var graphQLResp model.GraphQLResponse
	if err := json.NewDecoder(resp.Body).Decode(&graphQLResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	var stations []model.Station
	for _, dg := range graphQLResp.Data.DockGroups {
		// Clean data
		idStr := dg.Name
		if len(idStr) > 0 && idStr[0] == 'V' {
			idStr = "1000" + idStr[1:]
		}
		id, _ := strconv.Atoi(idStr)

		description := numberPrefixRegex.ReplaceAllString(dg.SubTitle, "")
		name := dashPrefixRegex.ReplaceAllString(dg.Title, "")

		var bikes []model.Bike
		for _, bc := range dg.AvailabilityInfo.AvailableVehicleCategories {
			bType := "NORMAL"
			if t, ok := bikeTypes[bc.Category]; ok {
				bType = t
			}
			bName := "Biciclette"
			if n, ok := bikeNames[bc.Category]; ok {
				bName = n
			}

			bikes = append(bikes, model.Bike{
				Count: bc.Count,
				Type:  bType,
				Name:  bName,
			})
		}
		// If bikes is nil, make it empty array for json output
		if bikes == nil {
			bikes = []model.Bike{}
		}

		st := model.Station{
			ID:              id,
			Description:     description,
			Name:            name,
			Latitude:        dg.Coord.Lat,
			Longitude:       dg.Coord.Lng,
			Active:          dg.Enabled,
			BikesCount:      dg.AvailabilityInfo.AvailableVehicles,
			SlotsCount:      dg.AvailabilityInfo.AvailableDocks + dg.AvailabilityInfo.AvailableVehicles,
			EmptySlotsCount: dg.AvailabilityInfo.AvailableDocks,
			Bikes:           bikes,
		}

		// Apply filters
		if params.OnlyActive && !st.Active {
			continue
		}
		if params.OnlyWithBikes && st.BikesCount == 0 {
			continue
		}
		if params.OnlyWithParking && st.EmptySlotsCount == 0 {
			continue
		}

		// Calculate distance if coordinates provided
		if params.Latitude != 0 && params.Longitude != 0 {
			st.Distance = CalculateDistance(st.Latitude, st.Longitude, params.Latitude, params.Longitude)
		}

		stations = append(stations, st)
	}

	// Sort by distance if applicable, otherwise by ID
	if params.Latitude != 0 && params.Longitude != 0 {
		sort.Slice(stations, func(i, j int) bool {
			return stations[i].Distance < stations[j].Distance
		})
	} else {
		sort.Slice(stations, func(i, j int) bool {
			return stations[i].ID < stations[j].ID
		})
	}

	// Return only first result if requested
	if params.OnlyFirstResult && len(stations) > 0 {
		return []model.Station{stations[0]}, nil
	}

	// Return empty array instead of null
	if stations == nil {
		stations = []model.Station{}
	}

	return stations, nil
}
