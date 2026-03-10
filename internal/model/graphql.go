package model

// GraphQLQuery is the request payload for the external API
type GraphQLQuery struct {
	Extensions    string `json:"extensions"`
	OperationName string `json:"operationName"`
}

// GraphQLResponse represents the response from the Urban Sharing API
type GraphQLResponse struct {
	Data GraphQLData `json:"data"`
}

type GraphQLData struct {
	DockGroups []DockGroup `json:"dockGroups"`
}

type DockGroup struct {
	Name             string           `json:"name"`
	SubTitle         string           `json:"subTitle"`
	Title            string           `json:"title"`
	Coord            Coord            `json:"coord"`
	Enabled          bool             `json:"enabled"`
	AvailabilityInfo AvailabilityInfo `json:"availabilityInfo"`
}

type Coord struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type AvailabilityInfo struct {
	AvailableVehicles          int                        `json:"availableVehicles"`
	AvailableDocks             int                        `json:"availableDocks"`
	AvailableVehicleCategories []AvailableVehicleCategory `json:"availableVehicleCategories"`
}

type AvailableVehicleCategory struct {
	Count    int    `json:"count"`
	Category string `json:"category"`
}
