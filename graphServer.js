import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import {products_model} from './models.js'
const app = express()


/////////// mongo
import {mongoConnection} from './db.js'
mongoose.connect(mongoConnection)
import mongoose from 'mongoose';
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }


const schema = buildSchema(`
    input ProductInput {
        product_name: String,
        product_description: String,
        product_price: Int,
        product_imgUrl: String,
        product_stock: Int
    }
    type Product {
        id: ID!,
        product_name: String,
        product_description: String,
        product_price: Int,
        product_imgUrl: String,
        product_stock: Int
    }
    type Query {
        getProduct(id: ID!): Product,
        getProducts(campo: String, valor: String): [Product],
    }
    type Mutation {
        createProduct(data: ProductInput): Product,
        updateProduct(id: ID!, data: ProductInput): Product,
        deleteProduct(id: ID!): Product,
    }
`);



// Controllers

const createProduct = async ({data}) => {

   const newProduct = await products_model.create(data)

    return newProduct
}

const getProduct = async ({id}) => {

    const prod = await products_model.find({id})
    
    return prod

}


const getProducts = async ({ campo, valor }) => {
    const products_array = await products_model.find();
  
    if (campo && valor) {
      return products_array.filter((product) => product[campo] == valor);
    } else {
      return products_array;
    }
  };

const updateProduct = async ({id, data}) => {

    
    const updatedProduct = await products_model.updateOne({_id: id},{$set:data})
    const newProduct = await products_model.findById(id)
    

    return newProduct

}

const deleteProduct = async ({id}) => {

    const product = await products_model.findById(id)
    const deletedProduct = await products_model.deleteOne({id})
    
    return product
}
///////////////////////////








//Middleware
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: {
        getProduct,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProduct
    },
    graphiql:true
}) )

///////////////////////








app.listen(3001, () => {
    console.log('Servidor con graph escuchando en puerto 3001')
})