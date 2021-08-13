--> Para fazer o migrations:

dotnet ef migrations add Initial -p .\Persistence\ -s .\API\

--> Para fazer update da migrations:

dotnet ef database update -s .\API\


Dentro do projeto de frontend/app, no arquivo tsconfig.json foi configurado atalhos para entrar no src e environments.
Nas linhas abaixo está a configuração do arquivo tsconfig.json


,
    "paths": {
      "@app/*": ["src/app/*"],
      "@environments/*": ["src/environments/*"]
}





Ao importar não é necessário usar ../ é só utilizar @app ou @assets ou @environments.
