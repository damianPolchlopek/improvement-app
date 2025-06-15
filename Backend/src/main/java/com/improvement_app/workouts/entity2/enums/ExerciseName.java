package com.improvement_app.workouts.entity2.enums;

public enum ExerciseName {
    PRZYCIAGANIE_WASKIEGO_UCHWYTU_POZIOMEGO_DO_BRZUCHA("Przyciąganie wąskiego uchwytu wyc poziomego do brzucha"),
    ZABKA("Żabka"),
    KETTLEBELL_DEADLIFT("Kettlebell deadlift"),
    RENEGADE_ROW("Renegade row"),
    KETTLEBELL_HIGH_PULL("Kettlebell high pull"),
    JUMPING_LUNGES("Jumping lunges"),
    WYCISKANIE_SZTANGI_NA_LAWCE_POZIOMEJ_RAMPA("Wyciskanie sztangi na ławce poziomej - rampa"),
    KRAUL("Kraul"),
    PODCIAGANIE_SZTANGI_WZDLUZ_TULOWIA("Podciąganie sztangi wzdłuż tułowia"),
    MILITARY_PRESS("Military press"),
    PROSTOWANIE_RAMION_Z_DRAZKIEM_Z_WYC_GORNEGO("Prostowanie ramion z drążkiem z użyciem wyc górnego"),
    KETTLEBELL_RUSSIAN_TWIST("Kettltbell Russian twist"),
    SCIAGANIE_WASKIEGO_UCHWYTU_Z_WYC_PIONOWEGO_DO_KLATKI("Ściąganie wąskiego uchwytu z wyc pionowego do klatki piersiowej"),
    WYCISKANIE_ZOLNIERSKIE("Wyciskanie żołnierskie"),
    UGINANIE_RAK_Z_HANTLAMI("Uginanie rąk z hantlami"),
    PLANK("Plank"),
    ROZPIETKI_NA_SKOSIE_30_ST("Rozpiętki na skosie 30 st"),
    UNOSZENIE_HANTLI_BOKIEM_W_OPADZIE_TULOWIA("Unoszenie hantli bokiem w opadzie tułowia"),
    KETTLEBELL_THRUSTER("Kettlebell thruster"),
    PRZYSIAD_NA_SUWNICY_SMITHA("Przysiad na suwnicy Smitha"),
    WIOSLOWANIE_KONCEM_SZTANGI_W_OPADZIE_TULOWIA("Wiosłowanie końcem sztangi w opadzie tułowia"),
    WYCISKANIE_HANTLI_NAD_GLOWE_SIEDZAC("Wyciskanie hantli nad głowę siedząc"),
    FRONT_RACK_SQUAT("Front rack squat"),
    BURPEE_Z_KETTLEBELL_CLEAN("Burpee z kettlebell clean"),
    PODCIAGANIE_NA_DRAZKU_NADCHWYTEM_SZEROKIM_Z_GUMA("Podciąganie na drążku nadchwytem szerokim z gumą"),
    DIPY("Dipy"),
    PRZYSIAD_KLASYCZNY("Przysiad klasyczny"),
    NORDIC_HAMSTRING_CURL("Nordic Hamstring Curl"),
    WIOSLOWANIE_HANTLA("Wiosowanie hantlą"),
    LEG_CURL("Leg Curl"),
    POMPKI("Pompki"),
    MC_KLASYCZNY("MC klasyczny"),
    UNOSZENIE_HANTLI_PRZODEM_Z_SUPINACJA_SIEDZAC("Unoszenie hantli przodem (z supinacją) siedząc"),
    GOBLET_SQUAT("Goblet squat"),
    SUITCASE_CARRY("Suitcase carry"),
    KETTLEBELL_SWING("Kettlebell swing"),
    CLEAN_AND_PRESS("Clean & press"),
    KETTLEBELL_SNATCH("Kettlebell snatch"),
    SCIAGANIE_DRAZKA_WYC_PIONOWEGO_DO_KLATKI_NACHWYTEM_RAMPA("Ściąganie drążka wyc pionowego do klatki piersiowej nachwytem - rampa"),
    WIOSLOWANIE_SZTANGA_NACHWYTEM_W_OPADZIE_TULOWIA("Wiosłowanie sztangą trzymaną nachwytem w opadzie tułowia"),
    UGINANIE_RAK_ZE_SZTANGA("Uginanie rąk ze sztangą"),
    UGINANIE_RAMION_NA_MODLITEWNIKU("Uginanie ramion na modlitewniku"),
    UGINANIE_NOG_NA_MASZYNIE_LEZAC_PRZODEM("Uginanie nóg na maszynie leżąc przodem"),
    ROZPIETKI_BRAMA("Rozpiętki - brama"),
    PODCIAGANIE_NA_DRAZKU_PODCHWYTEM_Z_GUMA("Podciąganie na drążku podchwytem z gumą"),
    WIOSLOWANIE_NA_MASZYNIE_V("Wiosłowanie na maszynie V"),
    UNOSZENIE_HANTLI_BOKIEM("Unoszenie hantli bokiem"),
    BIEZNIA("Bieżnia"),
    WIOSLARZ("Wioślarz"),
    HOLLOW_BODY_HOLD("Hollow body hold"),
    SINGLE_ARM_ROW("Single arm row"),
    PRZYSIAD_PRZEDNI("Przysiad przedni"),
    WYPAD_W_TYL_BEZ_OBCIAZENIA_PRZYSIAD_WYKROCZNY("Wypad w tył (bez obciążenia) + przysiad wykroczny"),
    WYCISKANIE_HANTLI_NA_SKOSIE_30_ST("Wyciskanie hantli na skosie 30 st"),
    PODCIAGANIE_NA_DRAZKU_NADCHWYTEM_SZEROKIM_RAMPA("Podciąganie na drążku nadchwytem szerokim - rampa");

    private final String displayName;

    ExerciseName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ExerciseName fromValue(String displayName) {
        for (ExerciseName exercise : ExerciseName.values()) {
            if (exercise.displayName.equals(displayName)) {
                return exercise;
            }
        }
        throw new IllegalArgumentException("No enum constant for display name: " + displayName);
    }

    @Override
    public String toString() {
        return displayName;
    }
}
