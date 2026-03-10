package api_test

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/maxcanna/bicineabbiamo/internal/api"
	"github.com/maxcanna/bicineabbiamo/internal/model"
	"github.com/maxcanna/bicineabbiamo/internal/service"
)

func TestE2E_API(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping E2E test in short mode")
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	stationSvc := service.NewStationService()
	server := api.NewServer(logger, stationSvc)

	t.Run("ValidParams", func(t *testing.T) {
		req, err := http.NewRequest(http.MethodGet, "/api?lat=45.464683238626&lon=9.18879747390747&onlyWithBikes=true&onlyWithParking=true&onlyFirstResult=true", nil)
		if err != nil {
			t.Fatalf("Could not create request: %v", err)
		}

		rr := httptest.NewRecorder()
		server.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Fatalf("Expected status 200, got %d. Body: %s", rr.Code, rr.Body.String())
		}

		var station model.Station
		if err := json.Unmarshal(rr.Body.Bytes(), &station); err != nil {
			t.Fatalf("Could not unmarshal response into single Station object: %v", err)
		}

		if station.ID == 0 {
			t.Errorf("Expected station ID to be non-zero")
		}
	})

	t.Run("InvalidParams", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, "/api?onlyActive=not_a_boolean", nil)
		rr := httptest.NewRecorder()
		server.ServeHTTP(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Expected status 400 for invalid boolean, got %d", rr.Code)
		}
	})
}
