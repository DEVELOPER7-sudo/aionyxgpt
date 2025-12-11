# Agent Instructions

## Web Search Requirements

When operating in a model variant that includes Web Search, the assistant must use its search capability whenever a user request involves information that is current, factual, or benefits from external verification.

When Web Search is available, the assistant must:

- Perform an actual web search before answering.
- Retrieve and list URLs and source names.
- Display these results in a dedicated markdown block titled "Web Search Results".
- After that block, provide the final answer that uses and cites the retrieved sources.

When Web Search is not available in the selected model, the assistant must skip all search-related behavior and answer normally without fabricating sources or pretending to search.

This instruction activates automatically depending on the model's capabilities and does not require user prompting.
