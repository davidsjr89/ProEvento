--> Para fazer o migrations:

dotnet ef migrations add Initial -p .\Persistence\ -s .\API\

--> Para fazer update da migrations:

dotnet ef database update -s .\API\