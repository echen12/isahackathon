const express = require('express')
const { Configuration, OpenAIApi } = require('openai');
const app = express()
const port = 3000

app.get('/', async (req, res) => {
    async function generateTags(commentText, orgTags = []) {
        const config = new Configuration({
            apiKey: CHATGPT_KEY,
        });
        const examples = orgTags.length >= 2 ? orgTags.map((tag) => tag.tagName) : ['fluency', 'coherence', 'clarity', 'meaning', 'style', 'other'];
        const openai = new OpenAIApi(config);
        // const prompt = `Classify the provided suggestion by providing one-word tags that describe the type of suggestion.
        //   Output in a comma-separated list. Aim for one tag, but more or less are allowed if required. 
        //   Suggestion: ${commentText}`;

        const prompt = `Can you provide sentiment labels and rough scores for sentences that I provide? Also suggest alternative sentences.
          Sentence: ${commentText}`;

        return await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        }).then((response) => {
            const output = response.data.choices[0].message.content;
            const newTags = output.split(',').map(x => x?.trim());
            return newTags;
        });
    }

    const tags = await generateTags(req.query.sent);

    res.send(JSON.stringify(tags))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})