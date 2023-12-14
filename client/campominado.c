#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "api.c"

#define tam 10
#define bomba 1
#define vazio 0

void nivel_dificuldade(int dificuldade, int aux[10][10], int t[10][10]);
void tabuleiro(int aux[10][10], int aux2[10][10]);
int tem_bomba(int matriz[10][10], int x, int y);
int score_cont(int aux[10][10]);
int tem_bomba2(int t[10][10], int aux[10][10], int aux2[10][10], int x, int y);

int main()
{
    // main
    srand(time(NULL));
    int perdeu = 0, score = 0, bombas = 0, jogadas = 0;
    int t[tam][tam], aux[tam][tam], aux2[tam][tam];
    int l, c, x, y;
    int dificuldade;

    for (l = 0; l < tam; l++)
        for (c = 0; c < tam; c++)
            aux2[l][c] = 0;

    // Chamando API para listar os scores
    listarScores();
    char username[30];
    printf("Digite seu nome de usuario: ");
    scanf(" %s", username);

    printf("Selecione a dificuldade:\n1 - Facil\n2 - Normal\n3 - Dificil\n");
    scanf("%d", &dificuldade);
    fflush(stdin);
    nivel_dificuldade(dificuldade, aux, t);
    for (l = 0; l < tam; l++)
        for (c = 0; c < tam; c++)
            if (t[l][c] == bomba)
                bombas++;
    while (1)
    {
        tabuleiro(aux, aux2);
        scanf("%d %d", &x, &y);
        if (jogadas == 0)
        {
            if (t[x][y] == bomba)
                bombas--;
            t[x][y] = vazio;
        }
        jogadas++;
        if (t[x][y] == bomba)
        {
            perdeu = 1;
            break;
        }
        aux[x][y] = tem_bomba(t, x, y);
        aux[x][y] = tem_bomba2(t, aux, aux2, x, y);
        for (l = 0; l < tam; l++)
            for (c = 0; c < tam; c++)
                if (aux2[l][c] == 1)
                    aux[l][c] = 0;
        score = score_cont(aux);
        if (score == ((100) - bombas))
            break;
    }
    // fim da main
    if (perdeu == 1)
    {
        for (l = 0; l < tam; l++)
            for (c = 0; c < tam; c++)
                aux2[l][c] = 0;
        printf("===\nVOCE PERDEU\n");
        tabuleiro(t, aux2);
        printf("SCORE: %d\n", score);
    }
    else
    {
        printf("===\nVOCE VENCEU\n");
    }
    // CHAMANDO API PARA REGISTRAR SCORE
    registrarScore(username, score, dificuldade);
    return 0;
}

void nivel_dificuldade(int dificuldade, int aux[10][10], int t[10][10])
{
    int l, c;
    if (dificuldade == 1)
        for (l = 0; l < tam; l++)
            for (c = 0; c < tam; c++)
            {
                if (rand() % 5 == 0)
                    t[l][c] = bomba;
                else
                    t[l][c] = vazio;
                aux[l][c] = 9;
            }
    else if (dificuldade == 2)
        for (l = 0; l < tam; l++)
            for (c = 0; c < tam; c++)
            {
                if (rand() % 4 == 0)
                    t[l][c] = bomba;
                else
                    t[l][c] = vazio;
                aux[l][c] = 9;
            }
    else if (dificuldade == 3)
        for (l = 0; l < tam; l++)
            for (c = 0; c < tam; c++)
            {
                t[l][c] = rand() % 2;
                aux[l][c] = 9;
            }
}
void tabuleiro(int aux[10][10], int aux2[10][10])
{
    int l, c;
    for (l = -1; l < tam; l++)
    {
        if (l > -1)
            printf("%d ", l);
        else
            printf("  ");
    }
    printf("\n");

    for (l = 0; l < tam; l++)
    {
        printf("%d ", l);
        for (c = 0; c < tam; c++)
        {
            if (aux[l][c] == 9)
                printf("# ");
            else
            {
                if (aux2[l][c] == 1)
                    printf("  ");
                else
                {
                    if (aux[l][c] > 0)
                        printf("%d ", aux[l][c]);
                    else
                        printf("  ");
                }
            }
        }
        printf("\n");
    }
}
int tem_bomba(int matriz[10][10], int x, int y)
{
    int n = 0, l, c;
    for (l = x - 1; l < x + 2; l++)
    {
        if (l < 0 || l > 9)
            continue;
        for (c = y - 1; c < y + 2; c++)
        {
            if (c < 0 || c > 9)
                continue;
            if (matriz[l][c] == bomba)
                n++;
        }
    }
    return n;
}
int tem_bomba2(int t[10][10], int aux[10][10], int aux2[10][10], int x, int y)
{
    int l, c;
    if (aux[x][y] == vazio)
    {
        aux2[x][y] = 1;
        for (l = x - 1; l < x + 2; l++)
        {
            if (l < 0 || l > 9)
                continue;
            for (c = y - 1; c < y + 2; c++)
            {
                if (c < 0 || c > 9 || aux2[l][c] == 1)
                    continue;
                aux[l][c] = tem_bomba(t, l, c);
                if (aux[l][c] == vazio)
                    aux[l][c] = tem_bomba2(t, aux, aux2, l, c);
            }
        }
    }
}
int score_cont(int aux[10][10])
{
    int l, c, n = 0;
    for (l = 0; l < 10; l++)
    {
        for (c = 0; c < 10; c++)
            if (aux[l][c] != 9)
                n++;
    }
    return n;
}

// comando para rodar: gcc campominado.c -lcurl -ljansson && ./a.out
//
