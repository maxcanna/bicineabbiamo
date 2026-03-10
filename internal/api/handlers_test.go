package api

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/maxcanna/bicineabbiamo/internal/model"
	"github.com/maxcanna/bicineabbiamo/internal/service"
)

type mockStationService struct{}

func (m *mockStationService) GetStations(ctx context.Context, params service.GetStationsParams) ([]model.Station, error) {
	return []model.Station{
		{
			ID:              1,
			Name:            "Duomo",
			Active:          true,
			BikesCount:      5,
			SlotsCount:      10,
			EmptySlotsCount: 5,
		},
	}, nil
}

func TestGetStations(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	svc := &mockStationService{}
	server := NewServer(logger, svc)

	req, _ := http.NewRequest("GET", "/api", nil)
	rr := httptest.NewRecorder()

	server.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var stations []model.Station
	if err := json.NewDecoder(rr.Body).Decode(&stations); err != nil {
		t.Fatal(err)
	}

	if len(stations) != 1 {
		t.Fatalf("expected 1 station, got %v", len(stations))
	}

	if stations[0].Name != "Duomo" {
		t.Errorf("expected station name Duomo, got %v", stations[0].Name)
	}
}

func TestGetStationsInvalidParams(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	svc := &mockStationService{}
	server := NewServer(logger, svc)

	tests := []struct {
		name   string
		params string
	}{
		{"InvalidLat", "lat=abc"},
		{"InvalidLon", "lon=abc"},
		{"InvalidOnlyActive", "onlyActive=abc"},
		{"InvalidOnlyWithBikes", "onlyWithBikes=abc"},
		{"InvalidOnlyWithParking", "onlyWithParking=abc"},
		{"InvalidOnlyFirstResult", "onlyFirstResult=abc"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/api?"+tt.params, nil)
			rr := httptest.NewRecorder()

			server.ServeHTTP(rr, req)

			if status := rr.Code; status != http.StatusBadRequest {
				t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
			}

			var response map[string]string
			if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
				t.Fatal(err)
			}
			if _, ok := response["error"]; !ok {
				t.Error("expected error message in response")
			}
		})
	}
}
