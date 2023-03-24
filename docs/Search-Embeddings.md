# 1. Search for Embeddings

You can look for embeddings in both the `Prompt` and `Negative Prompt` by pressing the "look for Embeddings" button. 

This feature searches through Civitai to check whether any part of your prompt is an embeddings.

# 2. Algorithm

To look for Embeddings, we take the following steps:

1. Split prompt by "," to get `promptPieces`.
2. Trim all `promptPieces`to remove access whitespaces.
3. Filter out those that still contain a space, as Embeddings do not do this, to find `potentialEmbeddings`.
4. For a final list of `potentialEmbeddings` filter out all words from our dictionary, as prompts are special and not common words.
5. For all `potentialEmbeddings`, do a search in Civitai to check whether they are an Embeddings.
6. For every potential Embedding that Civitai gave a response for, make sure that we have an exact match with one of the models versions.
7. List all found Embeddings.

## 2.1. Working with the dictionary

Our dictionary is a simple JSON file containing common english words and a list of words we know are popular in the text2image community.

It is loaded during runtime when needed and then stored for consecuritve requests.

### 2.1.1. Performance impact

The Dictionary takes up 1.1MB of data when being transferred. In contrast a Civitai request which returns a found embeddings takes ~10Kb. Which goes to say that just requesting all words from Civitai would take up less data, until we do 100.000 requests. As Stable-Diffusion prompts can contain up to 75 tokens and other tools are in a similar range, it is unlikely that we will encounter anywhere close that that amount of potential embeddings within our application.

We still use the dictionary, to keep the load on Civitai low.

### 2.1.2. Potential optimizations

We could optimize this by reducing the amount of words we load in to those more commonly used. Potentially finding a trade-off between limiting the amount of requests to Civitai and size of dictionary.

## 2.2. Oversearching

This algorithm searches Civitai for many words that a huma would easily identify as "not an Embedding". In the future we might improve here by checking words against a dictionary first.