import fs from "fs";
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
  const novoPost = req.body;
  try {
    const postCriado = await criarPost(novoPost);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro": "Falha na requisição"});
  }
}

export async function uploadImagem(req, res) {
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };
  try {
    const postCriado = await criarPost(novoPost);
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
    fs.renameSync(req.file.path, imagemAtualizada);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro": "Falha na requisição"});
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `${process.env.BASE_URL}/${id}.png`;
  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const campos = await gerarDescricaoComGemini(imgBuffer);
    const postAtualizado = {
       imgUrl: urlImagem,
       descricao: campos.description,
       alt: campos.alt
    }

    const postCriado = await atualizarPost(id, postAtualizado);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro": "Falha na requisição"});
  }
}
