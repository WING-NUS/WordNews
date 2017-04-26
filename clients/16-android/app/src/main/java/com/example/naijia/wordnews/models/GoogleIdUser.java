package com.example.naijia.wordnews.models;

public class GoogleIdUser implements User {
    private final String identifier;

    public GoogleIdUser(String ident) {
        identifier = ident;
    }

    public String name() {
        return identifier;
    }
}
