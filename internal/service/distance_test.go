package service

import (
	"math"
	"testing"
)

func TestCalculateDistance(t *testing.T) {
	// Milan: 45.4642, 9.1900
	// Rome: 41.9028, 12.4964
	lat1, lon1 := 45.4642, 9.1900
	lat2, lon2 := 41.9028, 12.4964

	dist := CalculateDistance(lat1, lon1, lat2, lon2)

	// Distance is approx 477km = 477000 meters
	expected := 477000.0
	tolerance := 5000.0 // 5km tolerance

	if math.Abs(dist-expected) > tolerance {
		t.Errorf("Expected distance ~%v meters, got %v meters", expected, dist)
	}
}
