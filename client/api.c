#include <stdio.h>
#include <curl/curl.h>
#include <jansson.h>
#include <string.h>

// Callback function for writing received data
size_t write_callback(void *ptr, size_t size, size_t nmemb, void *userdata)
{
  return fwrite(ptr, size, nmemb, (FILE *)userdata);
}

// Fetches the player scores from the API and prints them
void listarScores()
{
  CURL *curl;
  CURLcode res;

  curl = curl_easy_init();
  if (curl)
  {
    FILE *response_file = fopen("response.json", "w"); // Open a file to save the response
    if (response_file)
    {
      struct curl_slist *headers = NULL;
      headers = curl_slist_append(headers, "x-api-key: apikey");

      curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:8080/records");
      curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

      // Set write callback and file to write the response
      curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
      curl_easy_setopt(curl, CURLOPT_WRITEDATA, response_file);

      res = curl_easy_perform(curl);

      if (res != CURLE_OK)
        fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

      curl_easy_cleanup(curl);
      curl_slist_free_all(headers);

      fclose(response_file); // Close the file

      // Open the response file and parse JSON to print formatted output
      response_file = fopen("response.json", "r");
      if (response_file)
      {
        json_t *root;
        json_error_t error;

        root = json_loadf(response_file, 0, &error);
        if (root)
        {
          size_t index;
          json_t *record;
          printf("[Pontuação dos jogadores]:\n");
          int max_username_length = 0;
          int count = 0;
          json_array_foreach(root, index, record)
          {
            const char *username = json_string_value(json_object_get(record, "username"));
            int current_username_length = strlen(username);
            if (current_username_length > max_username_length)
            {
              max_username_length = current_username_length;
            }
            count++;
          }
          if (count == 0)
          {
            printf("Nenhuma pontuação disponível ainda.\n\n");
          }

          json_array_foreach(root, index, record)
          {
            const char *username = json_string_value(json_object_get(record, "username"));
            int points = json_integer_value(json_object_get(record, "points"));
            int difficulty = json_integer_value(json_object_get(record, "difficulty"));

            const char *difficultyString;
            switch (difficulty)
            {
            case 1:
              difficultyString = "Facil";
              break;
            case 2:
              difficultyString = "Normal";
              break;
            case 3:
              difficultyString = "Dificil";
              break;
            default:
              difficultyString = "Unknown";
              break;
            }

            int username_width = max_username_length;
            int points_width = 6;
            printf("%*zu. %-*s - %*dpts - [%s]\n", 2, index + 1, username_width, username, points_width, points, difficultyString);
          }
          json_decref(root);
        }
        else
        {
          fprintf(stderr, "Error parsing JSON: %s\n", error.text);
        }

        fclose(response_file);
      }
      else
      {
        fprintf(stderr, "Error opening response file.\n");
      }
    }
    else
    {
      fprintf(stderr, "Error creating/opening response file.\n");
    }
  }
}

// Posts the player score to the API
void registrarScore(const char *username, int score, int difficulty)
{
  CURL *curl;
  CURLcode res;

  curl = curl_easy_init();
  if (curl)
  {
    json_t *root = json_pack("{s:s, s:i, s:i}", "username", username, "points", score, "difficulty", difficulty);
    if (root)
    {
      char *post_data = json_dumps(root, 0);
      if (post_data)
      {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        headers = curl_slist_append(headers, "x-api-key: apikey");

        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:8080/records");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_data);

        res = curl_easy_perform(curl);

        if (res != CURLE_OK)
          fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);

        free(post_data);
        json_decref(root);
      }
      else
      {
        fprintf(stderr, "Error converting JSON to string.\n");
        json_decref(root);
      }
    }
    else
    {
      fprintf(stderr, "Error creating JSON object.\n");
    }
  }
}

// run: gcc api.c -lcurl -ljansson && ./a.out