# PersonalFinanceApi

Register to get your auth-token to access personal finance api.
after registration your data is empty and you need to add things.
you can also use my token which already has sample data.
my token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDFkZTYyZDM0MmVmYmFiM2YyMDk5OWQiLCJpYXQiOjE2Nzk2ODEwNjl9.MLIs7iucV2YkbolPk8P-EsYnPTrOfXyPtvVAA-yvojE

request headers :

Content-Type: application/json
auth-token: {your token}

routes:

POST /api/user/register
body:
{
    name: String required
    email: String required
    password: String required
}


POST /api/user/login
body:
{
    email: String required
    password: String required
}


get all categories
GET /api/categories


add new category
POST /api/categories
body:
{
    name: String required
}


get category by id
GET /api/categories/{id}


update category 
PUT /api/categories/{id}
body:
{
 name: String required
}

delete category
DELETE /api/categories/{id}
