
package com.example.tomato;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TomatoApplication {

    public static void main(String[] args) {
        SpringApplication.run(TomatoApplication.class, args);
    }
}

