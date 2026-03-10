package api

import (
	"log/slog"
	"net/http"

	"github.com/maxcanna/bicineabbiamo/internal/middleware"
	"github.com/maxcanna/bicineabbiamo/internal/service"
)

func NewServer(logger *slog.Logger, stationSvc service.StationService) http.Handler {
	mux := http.NewServeMux()

	baseHandler := NewHandler(logger)
	apiHandler := NewApiHandler(baseHandler, stationSvc)

	apiHandler.RegisterRoutes(mux)

	// Serve static files from /public
	fs := http.FileServer(http.Dir("./public"))
	mux.Handle("/", fs)

	// Apply middlewares
	var handler http.Handler = mux
	handler = middleware.Gzip(handler)
	handler = middleware.Logger(logger)(handler)

	return handler
}
