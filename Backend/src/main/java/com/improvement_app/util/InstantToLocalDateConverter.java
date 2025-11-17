package com.improvement_app.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

public class InstantToLocalDateConverter {
    public static LocalDate convert(Instant prevDate) {
        ZoneId zone = ZoneId.of("Europe/Warsaw");
        return prevDate.atZone(zone).toLocalDate();
    }
}
