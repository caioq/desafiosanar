# Desafio Sanar - Caio Queiroz

## Getting Started

O desafio foi realizado usando NodeJS. Para esta solução não foi utilizado banco de dados, porém seria uma alternativa para obtenção do campo ID dos planos.

### Instalando

Extrair o arquivo e executar o comando

```
npm install
```

### Iniciando

```
npm run start-server
```

## Testando

Para efetuar os testes é necessário primeiro realizar autenticação na api de integração.
Deve utilizar a seguinte URL:

```
http://localhost:3000/auth/login
```
com o body:

```
{
	"usuario": "sanar",
	"senha": "sanar"
}
```

Ao completar esta operação deve copiar o token retornado. 
Este token deverá ser usado no header dos próximos métodos:
```
Authorization: Bearer token 
```

### Caso 1

Request POST:
```
http://localhost:3000/assinatura/plano-mensal
```

Body de envio:
```
{
    "cliente": {
        "nome": "Mario Santos",
        "email": "mariosssss@gmail.com"
    },
    "cartao": {
        "numero": "4532464862385322",
        "nome_cartao": "Mario Henrique Santos",
        "expiracao_mes": 12,
        "expiracao_ano": 2019,
        "cvv": "113"
    }
}
```

### Caso 2

Request POST:
```
http://localhost:3000/assinatura/plano-mensal-7
```

Body de envio:

```
{
    "cliente_id": "cus_Nkm57zkcZAhkgaOj",
    "cartao": {
        "numero": "4532464862385322",
        "nome_cartao": "Juliana Santos",
        "expiracao_mes": 12,
        "expiracao_ano": 2019,
        "cvv": "113"
    }
}
```

### Caso 3

Request POST:
```
http://localhost:3000/assinatura/plano-trimestral
```

Body de envio:

```
{
    "cliente_id": "cus_ya68KGWH8Sd8Kl57",
    "cartao": {
        "numero": "4532464862385322",
        "nome_cartao": "Pedro Santos",
        "expiracao_mes": 12,
        "expiracao_ano": 2019,
        "cvv": "113"
    }
}
```

### Caso 4

Request PATCH:
```
http://localhost:3000/assinatura/alterar-cartao
```

Body de envio:

```
{
	"subscription_id": "sub_9lP2RnKtjFJo2Bbv",
	"cartao": {
		"nome_cartao": "Marcos A Alves",
		"numero": "4532912167490007",
		"expiracao_mes": 12,
		"expiracao_ano": 2020,
		"cvv": "112"
	}
}
```


### Caso 5

Request POST:
```
http://localhost:3000/assinatura/plano-mensal-yellowbook
```

Body de envio:

```
{
    "cliente_id": "cus_2lRB82eta6IQ0AYy",
    "cartao": {
        "numero": "4532464862385322",
        "nome_cartao": "Juliana Santos",
        "expiracao_mes": 12,
        "expiracao_ano": 2019,
        "cvv": "113"
    }
}
```

### Caso 6

Request DELETE:
```
http://localhost:3000/assinatura/cancelar
```

Body de envio:

```
{
	"subscription_id": "sub_9lP2RnKtjFJo2Bbv"
}
```
