package api

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
)

// AppHandler represents a handler function that returns an error
type AppHandler func(w http.ResponseWriter, r *http.Request) error

// APIError represents a structured API error
type APIError struct {
	Status  int
	Message string
	Err     error
}

func (e *APIError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *APIError) Unwrap() error {
	return e.Err
}

func NewAPIError(status int, message string, err error) *APIError {
	return &APIError{
		Status:  status,
		Message: message,
		Err:     err,
	}
}

func NewBadRequestError(fieldName string, err error) *APIError {
	return NewAPIError(http.StatusBadRequest, fmt.Sprintf("Invalid %s parameter", fieldName), err)
}

func NewInternalServerError(message string, err error) *APIError {
	return NewAPIError(http.StatusInternalServerError, message, err)
}

// Handler holds dependencies for API handlers
type Handler struct {
	logger *slog.Logger
}

func NewHandler(logger *slog.Logger) *Handler {
	return &Handler{logger: logger}
}

// Wrap converts an AppHandler into a standard http.HandlerFunc
func (h *Handler) Wrap(fn AppHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := fn(w, r); err != nil {
			h.handleError(w, r, err)
		}
	}
}

func (h *Handler) handleError(w http.ResponseWriter, r *http.Request, err error) {
	var apiErr *APIError
	if asErr, ok := err.(*APIError); ok {
		apiErr = asErr
	} else {
		apiErr = NewInternalServerError("Internal Server Error", err)
	}

	if apiErr.Status >= 500 {
		h.logger.Error("server error", "err", apiErr.Err, "path", r.URL.Path)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(apiErr.Status)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"error": apiErr.Message,
	})
}
