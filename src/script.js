import { Sequelize, DataTypes, Model, Op, QueryTypes } from 'sequelize';
import axios from 'axios';

const sequelize = new Sequelize('test', 'viper', 'PASSWORD', {
    host: 'localhost',
    dialect: 'mysql',
    logging: (...debug) => console.log(debug)
});

try{
    await sequelize.authenticate();
    console.log('\nConnected\n');
} catch(err){
    console.error('\nUnable to connect to the database' + err + '\n');
};

class Repos extends Model {};

Repos.init({
    repo_id: {
        type: DataTypes.INTEGER,
        get(){
            const idValue = this.getDataValue('repo_id');
            return idValue ? 'id :' + idValue: null
        }
    },
    name: {
        type: DataTypes.STRING,
        get(){
            const rawValue = this.getDataValue('name');
            return rawValue ? 'name :' + rawValue: null
        }
    },
    url: {
        type: DataTypes.STRING,
        get(){
            const url_link = this.getDataValue('url');
            return url_link ? 'url: ' + url_link : null
        }
    },
    visibility: {
        type: DataTypes.STRING,
        get(){
            const visibValue = this.getDataValue('visibility');
            return visibValue ? 'visibility: ' + visibValue + '\n': null
        }
    } }, {
        sequelize,
        modelName: 'Repos',
        tableName: 'repos'
    }
);
await Repos.sync();


const response = await axios.get('https://api.github.com/users/PatrickLeonardo/repos');

const size = Object.keys(response).length - 1;
const data = response.data;
for (var c = 0; c < size; c++){
    const rep = await Repos.create({
        repo_id: data[c].id,
        name: data[c].name,
        url: data[c].html_url,
        visibility: data[c].visibility
    });
    let data_list = [rep.repo_id, rep.name, rep.url, rep.visibility];
    for (var i = 0; i < size; i++){
        console.log(data_list[i]);
    };
};


if (Repos.findAll() !== []){
    await Repos.findAll().then(build => {
        console.log(JSON.stringify(build));
    })
}

// await Repos.drop();
