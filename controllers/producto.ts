import {Request,Response} from 'express';
import { json } from 'sequelize';
import Producto from '../models/producto';

export const getProductos = async(req: Request , res: Response)=>{

    const productos = await Producto.findAll();

    res.json({productos});
}

export const getProducto = async(req:Request,res:Response)=>{

    const {id} = req.params;
    const producto = await Producto.findByPk(id);

    if(producto)
    {
        res.json(producto);
    }
    else
    {
        res.status(404).json({
            msg:`No existe un producto con el id${id}`
        });
    }

}
export const putProducto = async(req:Request,res:Response)=>
{
    const {id} = req.params;
    const {body} = req;

    try{
        const producto = await Producto.findByPk(id);
        if(!producto)
        {
            return res.status(404).json({
                msg:'No existe un producto con ese id'
            });
        }

    }catch( error ){
        console.log(error);
        res.status(500).json({
            msg:'Hable con el administrador'
        });
    }
}
export const postProducto = async(req:Request,res:Response)=>{
    const {body} = req;
    try{
        const existeNombreProducto = await Producto.findOne({
            where:{
                nombre:body.nombre
            }
        });
        if(existeNombreProducto)
        {
            return res.status(400).json({
                msg:'Ya existe un producto con el nombre ' + body.nombre
            });
        }
        const producto = Producto.build(body)
        await producto.save();
        
        res.json(producto);
    }catch(error)
    {
        console.log(error);
        res.status(500).json({
            msg:'Hable con el administrador'
        })
    }
}
export const deleteProducto = async(req:Request,res:Response)=>{

    const {id} = req.params;

    const producto = await Producto.findByPk(id);

    if(!producto)
    {
        return res.status(404).json({
            msg:'No existe un producto con ese id'
        });
    }

    await producto.update({estado: false});

    //Eliminacion fisica del objeto
    // await producto.destroy()
    res.json(producto);
}