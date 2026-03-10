package middleware

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLogger(t *testing.T) {
	var buf bytes.Buffer
	logger := slog.New(slog.NewJSONHandler(&buf, nil))
	handler := Logger(logger)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	t.Run("Logs User-Agent", func(t *testing.T) {
		buf.Reset()
		req := httptest.NewRequest("GET", "/test", nil)
		userAgent := "TestAgent/1.0"
		req.Header.Set("User-Agent", userAgent)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		var logEntry map[string]any
		if err := json.Unmarshal(buf.Bytes(), &logEntry); err != nil {
			t.Fatalf("failed to parse log entry: %v", err)
		}

		if logEntry["user_agent"] != userAgent {
			t.Errorf("expected user_agent %q, got %q", userAgent, logEntry["user_agent"])
		}
	})

	t.Run("Trusts X-Forwarded-For", func(t *testing.T) {
		buf.Reset()
		req := httptest.NewRequest("GET", "/test", nil)
		xff := "1.2.3.4, 5.6.7.8"
		req.Header.Set("X-Forwarded-For", xff)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		var logEntry map[string]any
		if err := json.Unmarshal(buf.Bytes(), &logEntry); err != nil {
			t.Fatalf("failed to parse log entry: %v", err)
		}

		if logEntry["remote_addr"] != "1.2.3.4" {
			t.Errorf("expected remote_addr %q, got %q", "1.2.3.4", logEntry["remote_addr"])
		}
	})

	t.Run("Falls back to RemoteAddr if no X-Forwarded-For", func(t *testing.T) {
		buf.Reset()
		req := httptest.NewRequest("GET", "/test", nil)
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		var logEntry map[string]any
		if err := json.Unmarshal(buf.Bytes(), &logEntry); err != nil {
			t.Fatalf("failed to parse log entry: %v", err)
		}

		if !strings.HasPrefix(logEntry["remote_addr"].(string), "192.0.2.1") { // Default httptest remote addr
			t.Errorf("expected remote_addr prefix %q, got %q", "192.0.2.1", logEntry["remote_addr"])
		}
	})
}
