const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
	

let cont = 0;
function contRequisicoes (req, res, next) {
	cont++;

	console.log(`Método: ${req.method}; URL: ${req.url}; id: ${req.body.id}; title: ${req.body.title}`);//log de monitoramento
	console.log(`Número de requisições: ${cont}`);

	return next();
};

function checkProjectExists(req, res, next){
	const { id } = req.params.index;
	const project = projects.find(p => p.id == id);

	if(!project){
		return res.status(400).json({ error: 'Project does not exists'});
	}

	return next();
}


server.use(contRequisicoes); //contagem de requisições, utilizando server.use não é necessário passar
//como parametro na chamada da rota

server.get('/projects', (req, res) =>{
	return res.json(projects);
});

server.get('/projects/:index', checkProjectExists, (req, res) =>{
	const { index } = req.params;

	return res.json(projects[index]);
});

server.post('/projects', (req, res) =>{
	const { id, title } = req.body;

	const project = {
	    id,
	    title,
	    tasks: []
	  };

  	projects.push(project);

	return res.json(project);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) =>{
	const { index } = req.params;
	const { title } = req.body;

	const project = projects.findIndex(p => p.index == index);
	project[title] = title;

	return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) =>{
	const { id } = req.params;

	const index = projects.findIndex(p => p.id == id);

	projects.splice(index, 1);

	return res.send();
});

server.listen(3000);

