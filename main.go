package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Hello World!")
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.ListenAndServe(":8080", nil)
}
