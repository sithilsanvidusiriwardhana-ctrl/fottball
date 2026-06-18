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

// Function to input match data from user
void inputMatch(Match *match) {
    printf("\n--- Enter Match Details ---\n");
    printf("Date (YYYY-MM-DD): ");
    scanf("%s", match->date);
    printf("Year: ");
    scanf("%d", &match->year);
    printf("Stage (Group/Knockout/Final): ");
    scanf("%s", match->stage);
    printf("Home Team: ");
    scanf("%s", match->homeTeam);
    printf("Away Team: ");
    scanf("%s", match->awayTeam);
    printf("Home Goals: ");
    scanf("%d", &match->homeGoals);
    printf("Away Goals: ");
    scanf("%d", &match->awayGoals);
    printf("Winner: ");
    scanf("%s", match->winner);
    printf("Venue: ");
    scanf("%s", match->venue);
}

// Function to input player data from user
void inputPlayer(Player *player) {
    printf("\n--- Enter Player Details ---\n");
    printf("Player Name: ");
    scanf("%s", player->name);
    printf("Team: ");
    scanf("%s", player->team);
    printf("Position: ");
    scanf("%s", player->position);
    printf("Age: ");
    scanf("%d", &player->age);
    printf("Jersey Number: ");
    scanf("%d", &player->jersey);
    printf("Goals: ");
    scanf("%d", &player->goals);
    printf("Assists: ");
    scanf("%d", &player->assists);
    printf("Rating (0-10): ");
    scanf("%f", &player->rating);
}

// Function to display menu
int displayMenu() {
    int choice;
    printf("\n===== Sports Data Collection System =====\n");
    printf("1. Load data from CSV files\n");
    printf("2. Enter match data manually\n");
    printf("3. Enter player data manually\n");
    printf("4. Generate JSON and Exit\n");
    printf("5. Exit\n");
    printf("Enter your choice (1-5): ");
    scanf("%d", &choice);
    return choice;
}

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
    int choice;
    
    // Menu-driven data entry system
    while (1) {
        choice = displayMenu();
        
        switch(choice) {
            case 1:
                // Load from CSV files
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
                    printf("\n✓ Loaded %d matches from CSV.\n", match_count);
                }
                
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
                    printf("✓ Loaded %d players from CSV.\n", player_count);
                }
                break;
                
            case 2:
                // Enter match data manually
                if (match_count < MAX_MATCHES) {
                    inputMatch(&matches[match_count]);
                    match_count++;
                    printf("✓ Match added! Total matches: %d\n", match_count);
                } else {
                    printf("✗ Maximum matches reached!\n");
                }
                break;
                
            case 3:
                // Enter player data manually
                if (player_count < MAX_PLAYERS) {
                    inputPlayer(&players[player_count]);
                    player_count++;
                    printf("✓ Player added! Total players: %d\n", player_count);
                } else {
                    printf("✗ Maximum players reached!\n");
                }
                break;
                
            case 5:
                // Exit without generating
                printf("Exiting without saving changes.\n");
                fclose(output);
                return EXIT_SUCCESS;
                
            default:
                printf("✗ Invalid choice! Please enter 1-5.\n");
                continue;
        }
    }

generate:
    // If no data, use default
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
