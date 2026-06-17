#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *fp = fopen("data.json", "w");
    if (!fp) {
        perror("Unable to open data.json");
        return EXIT_FAILURE;
    }

    fprintf(fp, "{\n");
    fprintf(fp, "  \"matches\": [\n");
    fprintf(fp, "    {\"date\": \"2018-06-14\", \"year\": 2018, \"stage\": \"Group\", \"homeTeam\": \"Russia\", \"awayTeam\": \"Saudi Arabia\", \"homeGoals\": 5, \"awayGoals\": 0, \"winner\": \"Russia\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2018-06-15\", \"year\": 2018, \"stage\": \"Group\", \"homeTeam\": \"Egypt\", \"awayTeam\": \"Uruguay\", \"homeGoals\": 0, \"awayGoals\": 1, \"winner\": \"Uruguay\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2018-06-16\", \"year\": 2018, \"stage\": \"Group\", \"homeTeam\": \"Portugal\", \"awayTeam\": \"Spain\", \"homeGoals\": 3, \"awayGoals\": 3, \"winner\": \"Draw\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2014-07-13\", \"year\": 2014, \"stage\": \"Final\", \"homeTeam\": \"Germany\", \"awayTeam\": \"Argentina\", \"homeGoals\": 1, \"awayGoals\": 0, \"winner\": \"Germany\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2014-07-08\", \"year\": 2014, \"stage\": \"Semi\", \"homeTeam\": \"Argentina\", \"awayTeam\": \"Netherlands\", \"homeGoals\": 0, \"awayGoals\": 0, \"winner\": \"Argentina\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2010-07-11\", \"year\": 2010, \"stage\": \"Final\", \"homeTeam\": \"Spain\", \"awayTeam\": \"Netherlands\", \"homeGoals\": 1, \"awayGoals\": 0, \"winner\": \"Spain\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2022-12-18\", \"year\": 2022, \"stage\": \"Final\", \"homeTeam\": \"Argentina\", \"awayTeam\": \"France\", \"homeGoals\": 3, \"awayGoals\": 3, \"winner\": \"Argentina\", \"venue\": \"\"},\n");
    fprintf(fp, "    {\"date\": \"2026-11-20\", \"year\": 2026, \"stage\": \"Group\", \"homeTeam\": \"United States\", \"awayTeam\": \"Germany\", \"homeGoals\": 0, \"awayGoals\": 0, \"winner\": \"\", \"venue\": \"TBD\"},\n");
    fprintf(fp, "    {\"date\": \"2026-11-21\", \"year\": 2026, \"stage\": \"Group\", \"homeTeam\": \"Brazil\", \"awayTeam\": \"Spain\", \"homeGoals\": 0, \"awayGoals\": 0, \"winner\": \"\", \"venue\": \"TBD\"}\n");
    fprintf(fp, "  ],\n");
    fprintf(fp, "  \"players\": [\n");
    fprintf(fp, "    {\"name\": \"Lionel Messi\", \"team\": \"Argentina\", \"position\": \"Forward\", \"age\": 35, \"jersey\": 10, \"goals\": 7, \"assists\": 3, \"rating\": 9.7},\n");
    fprintf(fp, "    {\"name\": \"Kylian Mbappé\", \"team\": \"France\", \"position\": \"Forward\", \"age\": 26, \"jersey\": 10, \"goals\": 6, \"assists\": 2, \"rating\": 9.4},\n");
    fprintf(fp, "    {\"name\": \"Neymar Jr.\", \"team\": \"Brazil\", \"position\": \"Forward\", \"age\": 31, \"jersey\": 10, \"goals\": 5, \"assists\": 4, \"rating\": 9.1},\n");
    fprintf(fp, "    {\"name\": \"Harry Kane\", \"team\": \"England\", \"position\": \"Forward\", \"age\": 30, \"jersey\": 9, \"goals\": 4, \"assists\": 1, \"rating\": 8.8},\n");
    fprintf(fp, "    {\"name\": \"Luka Modrić\", \"team\": \"Croatia\", \"position\": \"Midfielder\", \"age\": 38, \"jersey\": 10, \"goals\": 2, \"assists\": 5, \"rating\": 8.6}\n");
    fprintf(fp, "  ]\n");
    fprintf(fp, "}\n");

    fclose(fp);
    printf("Generated data.json successfully.\n");
    return EXIT_SUCCESS;
}
