const { Client } = require('whatsapp-web.js');
const qrcode = require("qrcode-terminal");

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const client = new Client({
     puppeteer: {
        headless: true, // usa para visibilidar o Chrome
        executablePath: chromePath, // usa o Chrome instalado
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
     },
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr,{small : true});
});

client.on('ready', () => {
    console.log('✅ Bot do TodioDev está pronto!');
    enviar("Ola!, Sou o bot do TodioDev,pronto para ajudar")
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname || "amigo";

    const texto = msg.body.trim().toLowerCase(); // normaliza o texto

    // Função helper: simula digitando e responde após 2s
    async function responder(textoResposta) {
        await chat.sendStateTyping(); // mostra “digitando…”
        setTimeout(async () => {
            await msg.reply(textoResposta);
            //await msg.sendMessage(msg.from,textoResposta)
            await chat.clearState(); // remove o “digitando…”
        }, 2000);
    }

    async function enviar(message){
        await chat.sendStateTyping();
        setTimeout(async () => {
            await msg.sendMessage(msg.from,message);
            await chat.clearState();
        } ,2000);
    }

    // Respostas baseadas no menu
    if (["ola", "oi", "menu"].includes(texto)) {
        await enviar(`Olá ${name}! 👋 Tudo bem? Aqui fala o bot do TodioDev.  
Em que posso ajudar? Para ver os comandos digite *!comandos*`);
    
    } else if (texto === "!comandos") {
        await responder("📋 Aqui estão os comandos disponíveis:\n\n- Serviços\n- Dicas\n- Contato\n- Preços");

    } else if (texto === "serviços") {
        await responder("💼 Ofereço os seguintes serviços:\n\n- Vendas de Bots/Automação\n- Páginas Web\n- Consultoria em TI");

    } else if (texto === "dicas") {
        await responder("💡 Dicas de TI:\n1️⃣ Mantenha o sistema atualizado\n2️⃣ Use senhas fortes\n3️⃣ Cuidado com links suspeitos");

    } else if (texto === "contato") {
        await responder("📞 Contato do TodioDev:\nTelefone: 8337423480\nEmail: todiodev3300@gmail.com");

    } else if (texto === "preços") {
        await responder("💰 Tabela de preços:\n\n- Bot Básico: 100 MZN/mês\n- Bot Intermédio: suporte a imagens, vídeos e reações");

    } else {
        await enviar("❓ Não entendi a mensagem.  Tenta escrever: *ola*, *oi*, *menu* ou *!comandos* para começar.");
    }
});

client.initialize();
