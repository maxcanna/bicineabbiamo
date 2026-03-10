package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/maxcanna/bicineabbiamo/internal/service"
)

const (
	ParamLatitude        = "lat"
	ParamLongitude       = "lon"
	ParamOnlyActive      = "onlyActive"
	ParamOnlyWithBikes   = "onlyWithBikes"
	ParamOnlyWithParking = "onlyWithParking"
	ParamOnlyFirstResult = "onlyFirstResult"
)

type ApiHandler struct {
	*Handler
	stationSvc service.StationService
}

func NewApiHandler(h *Handler, svc service.StationService) *ApiHandler {
	return &ApiHandler{Handler: h, stationSvc: svc}
}

func (h *ApiHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api", h.Wrap(h.getStations))
}

func (h *ApiHandler) getStations(w http.ResponseWriter, r *http.Request) error {
	q := r.URL.Query()

	var lat, lon float64
	var err error
	if latStr := q.Get(ParamLatitude); latStr != "" {
		lat, err = strconv.ParseFloat(latStr, 64)
		if err != nil {
			return NewBadRequestError(ParamLatitude, err)
		}
	}

	if lonStr := q.Get(ParamLongitude); lonStr != "" {
		lon, err = strconv.ParseFloat(lonStr, 64)
		if err != nil {
			return NewBadRequestError(ParamLongitude, err)
		}
	}

	onlyActive, err := parseBoolParam(q.Get(ParamOnlyActive), true)
	if err != nil {
		return NewBadRequestError(ParamOnlyActive, err)
	}

	onlyWithBikes, err := parseBoolParam(q.Get(ParamOnlyWithBikes), false)
	if err != nil {
		return NewBadRequestError(ParamOnlyWithBikes, err)
	}

	onlyWithParking, err := parseBoolParam(q.Get(ParamOnlyWithParking), false)
	if err != nil {
		return NewBadRequestError(ParamOnlyWithParking, err)
	}

	onlyFirstResult, err := parseBoolParam(q.Get(ParamOnlyFirstResult), false)
	if err != nil {
		return NewBadRequestError(ParamOnlyFirstResult, err)
	}

	params := service.GetStationsParams{
		Latitude:        lat,
		Longitude:       lon,
		OnlyActive:      onlyActive,
		OnlyWithBikes:   onlyWithBikes,
		OnlyWithParking: onlyWithParking,
		OnlyFirstResult: onlyFirstResult,
	}

	stations, err := h.stationSvc.GetStations(r.Context(), params)
	if err != nil {
		return NewInternalServerError("Failed to retrieve stations", err)
	}

	w.Header().Set("Content-Type", "application/json")
	var payload any = stations
	if onlyFirstResult {
		if len(stations) > 0 {
			payload = stations[0]
		} else {
			payload = nil
		}
	}

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		return NewInternalServerError("Failed to encode response", err)
	}

	return nil
}

func parseBoolParam(val string, defaultVal bool) (bool, error) {
	if val == "" {
		return defaultVal, nil
	}
	b, err := strconv.ParseBool(val)
	if err != nil {
		return false, err
	}
	return b, nil
}
