package model

// Bike represents the count and category of a specific bike type
type Bike struct {
	Count int    `json:"count"`
	Type  string `json:"type"`
	Name  string `json:"name"`
}

// Station represents a BikeMi station and its status
type Station struct {
	ID              int     `json:"id"`
	Description     string  `json:"description"`
	Name            string  `json:"name"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	Active          bool    `json:"active"`
	BikesCount      int     `json:"bikescount"`
	SlotsCount      int     `json:"slotscount"`
	EmptySlotsCount int     `json:"emptyslotscount"`
	Bikes           []Bike  `json:"bikes"`
	Distance        float64 `json:"distance,omitempty"`
}
