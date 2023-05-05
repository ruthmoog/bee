package main

import (
	"fmt"
	"net/http"
)

type beeHttpHandler struct {
}

func (b beeHttpHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello world!")
}

func main() {
	fmt.Println("Hello World!")
	handler := beeHttpHandler{}
	http.ListenAndServe(":8080", handler)
}
