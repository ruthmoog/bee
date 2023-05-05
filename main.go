package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	fmt.Println("Hello World!")
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	http.ListenAndServe(":"+port, nil)
}
