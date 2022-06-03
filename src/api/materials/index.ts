import Router from 'koa-router';
import { authorizedApp } from '../../libs/middlewares/authorized';
import addMaterialAPI from './addMaterial';
import listMaterialsAPI from './listMaterials';
import readMaterialAPI from './readMaterial';
import removeMaterialAPI from './removeMaterial';
import updateMaterialAPI from './updateMaterial';

const materials = new Router();

materials.post('/', authorizedApp, addMaterialAPI);
materials.get('/', authorizedApp, listMaterialsAPI);
materials.get('/:id', authorizedApp, readMaterialAPI);
materials.delete('/:id', authorizedApp, removeMaterialAPI);
materials.patch('/:id', authorizedApp, updateMaterialAPI);

export default materials;
