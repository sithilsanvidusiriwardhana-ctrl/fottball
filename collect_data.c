#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_MATCHES 100
#define MAX_PLAYERS 50
#define MAX_NAME 100

typedef struct {
    char date[20];
    int year;
    char stage[20];
    char homeTeam[50];
    char awayTeam[50];
    int homeGoals;
    int awayGoals;
    char winner[50];
    char venue[100];
} Match;

typedef struct {
    char name[MAX_NAME];
    char team[50];
    char position[20];
    int age;
    int jersey;
    int goals;
    int assists;
    float rating;
} Player;

int main(void) {
    FILE *input = fopen("matches_input.csv", "r");
    FILE *players_input = fopen("players_input.csv", "r");
    FILE *output = fopen("data.json", "w");
    
    if (!output) {
        perror("Unable to open data.json");
        return EXIT_FAILURE;
    }

    Match matches[MAX_MATCHES];
    Player players[MAX_PLAYERS];
    int match_count = 0, player_count = 0;

    // Read matches from CSV file (if exists)
    if (input) {
        char line[500];
        fgets(line, sizeof(line), input); // Skip header
        while (fgets(line, sizeof(line), input) && match_count < MAX_MATCHES) {
            sscanf(line, "%[^,],%d,%[^,],%[^,],%[^,],%d,%d,%[^,],%s",
                   matches[match_count].date,
                   &matches[match_count].year,
                   matches[match_count].stage,
                   matches[match_count].homeTeam,
                   matches[match_count].awayTeam,
                   &matches[match_count].homeGoals,
                   &matches[match_count].awayGoals,
                   matches[match_count].winner,
                   matches[match_count].venue);
            match_count++;
        }
        fclose(input);
    }

    // Read players from CSV file (if exists)
    if (players_input) {
        char line[500];
        fgets(line, sizeof(line), players_input); // Skip header
        while (fgets(line, sizeof(line), players_input) && player_count < MAX_PLAYERS) {
            sscanf(line, "%[^,],%[^,],%[^,],%d,%d,%d,%d,%f",
                   players[player_count].name,
                   players[player_count].team,
                   players[player_count].position,
                   &players[player_count].age,
                   &players[player_count].jersey,
                   &players[player_count].goals,
                   &players[player_count].assists,
                   &players[player_count].rating);
            player_count++;
        }
        fclose(players_input);
    }

    // If no CSV files, use default data
    if (match_count == 0) {
        strcpy(matches[0].date, "2018-06-14");
        matches[0].year = 2018;
        strcpy(matches[0].stage, "Group");
        strcpy(matches[0].homeTeam, "Russia");
        strcpy(matches[0].awayTeam, "Saudi Arabia");
        matches[0].homeGoals = 5;
        matches[0].awayGoals = 0;
        strcpy(matches[0].winner, "Russia");
        strcpy(matches[0].venue, "");
        match_count = 1;
    }

    if (player_count == 0) {
        strcpy(players[0].name, "Lionel Messi");
        strcpy(players[0].team, "Argentina");
        strcpy(players[0].position, "Forward");
        players[0].age = 35;
        players[0].jersey = 10;
        players[0].goals = 7;
        players[0].assists = 3;
        players[0].rating = 9.7;
        player_count = 1;
    }

    // Write to JSON
    fprintf(output, "{\n");
    fprintf(output, "  \"matches\": [\n");
    for (int i = 0; i < match_count; i++) {
        fprintf(output, "    {\"date\": \"%s\", \"year\": %d, \"stage\": \"%s\", \"homeTeam\": \"%s\", \"awayTeam\": \"%s\", \"homeGoals\": %d, \"awayGoals\": %d, \"winner\": \"%s\", \"venue\": \"%s\"}",
                matches[i].date, matches[i].year, matches[i].stage,
                matches[i].homeTeam, matches[i].awayTeam,
                matches[i].homeGoals, matches[i].awayGoals,
                matches[i].winner, matches[i].venue);
        if (i < match_count - 1) fprintf(output, ",");
        fprintf(output, "\n");
    }
    fprintf(output, "  ],\n");
    fprintf(output, "  \"players\": [\n");
    for (int i = 0; i < player_count; i++) {
        fprintf(output, "    {\"name\": \"%s\", \"team\": \"%s\", \"position\": \"%s\", \"age\": %d, \"jersey\": %d, \"goals\": %d, \"assists\": %d, \"rating\": %.1f}",
                players[i].name, players[i].team, players[i].position,
                players[i].age, players[i].jersey,
                players[i].goals, players[i].assists, players[i].rating);
        if (i < player_count - 1) fprintf(output, ",");
        fprintf(output, "\n");
    }
    fprintf(output, "  ]\n");
    fprintf(output, "}\n");

    fclose(output);
    printf("Generated data.json successfully with %d matches and %d players.\n", match_count, player_count);
    return EXIT_SUCCESS;
}
