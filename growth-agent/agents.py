"""
Growth Agent — CrewAI Agent Definitions

Two agents:
  1. TrafficAnalystAgent  — reads analytics, proposes growth improvements
  2. ContentOutreachAgent — finds relevant threads/videos, drafts PT-BR comments
"""
from crewai import Agent
import config
from tools import AnalyticsSummaryTool, RedditSearchTool, YouTubeSearchTool


def build_traffic_analyst() -> Agent:
    """
    Analyzes GA4/Vercel analytics data and produces a prioritized
    Markdown report with concrete growth recommendations.
    """
    return Agent(
        role="Traffic Analyst for Brazilian Marketplace Calculator",
        goal=(
            "Analyze recent traffic data for calculadora.dbcdatastudio.com and "
            "produce a concise, actionable Markdown report with 3–5 prioritized "
            "recommendations to increase organic traffic, reduce mobile bounce rate, "
            "and improve user engagement."
        ),
        backstory=(
            "You are a senior growth analyst specializing in Portuguese-language "
            "web apps targeting Brazilian e-commerce sellers. "
            "You understand that the app's primary monetization path is Google Ads, "
            "so traffic quality (low bounce, high session duration) matters as much "
            "as raw visitor counts. "
            "You are data-driven: you always cite specific numbers from the analytics "
            "before making a recommendation. "
            "You know the competitive landscape (lidercommerce.com.br, dogama.com.br, "
            "lavnet.com.br) and keep SEO opportunity keywords in mind: "
            "'simulador de lucro shopee', 'simulador de custos mercado livre'. "
            "You never make vague suggestions — every recommendation includes "
            "a concrete next action."
        ),
        tools=[AnalyticsSummaryTool()],
        llm=config.LLM_MODEL,
        verbose=True,
        allow_delegation=False,
        max_iter=3,
    )


def build_content_outreach_agent() -> Agent:
    """
    Discovers high-intent YouTube videos and Reddit threads about
    marketplace fees / profit calculation, then drafts helpful PT-BR comments.
    Does NOT post automatically — output is for human review only.
    """
    return Agent(
        role="Content Outreach Specialist for Brazilian E-commerce Community",
        goal=(
            "Find 5–10 high-intent YouTube videos and Reddit threads where "
            "Brazilian marketplace sellers discuss fees, profit calculation, or pricing. "
            "Draft one helpful, non-spammy comment per link written in Brazilian Portuguese. "
            "Comments must add genuine value first; the app can be mentioned as a free "
            "resource only when it is naturally relevant."
        ),
        backstory=(
            "You are a community-first content marketer who has built trust in Brazilian "
            "e-commerce communities over years. "
            "Your golden rule: never spam. A comment that doesn't help the original poster "
            "does more harm than good. "
            "You write in casual but professional Brazilian Portuguese (pt-BR), "
            "using common seller terminology (vendedor, taxa, comissão, lucro líquido). "
            "You know the app well: it is a free, no-login profit calculator for "
            "Shopee, Mercado Livre (Clássico e Premium), and Pix — "
            "updated with Março 2026 fees. URL: https://calculadora.dbcdatastudio.com. "
            "You only mention the app when it is a direct, relevant answer to the thread. "
            "You NEVER auto-post. All output is a draft for human review."
        ),
        tools=[RedditSearchTool(), YouTubeSearchTool()],
        llm=config.LLM_MODEL,
        verbose=True,
        allow_delegation=False,
        max_iter=4,
    )
