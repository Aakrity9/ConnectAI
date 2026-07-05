from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
from config import settings
from openai import OpenAI

app = FastAPI(title="ConnectAI AI Service", version="1.0.0")

# Lazy initialize client to allow server start without immediate API key validation
_client = None

def get_openai_client():
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client

class EmbeddingRequest(BaseModel):
    text: str

class EmbeddingResponse(BaseModel):
    embedding: List[float]

class ProfileSchema(BaseModel):
    name: Optional[str] = "Attendee"
    skills: List[str] = []
    interests: List[str] = []
    goals: List[str] = []

class MatchRequest(BaseModel):
    profile1: ProfileSchema
    profile2: ProfileSchema

class MatchExplanationResponse(BaseModel):
    explanation: str

class IcebreakerResponse(BaseModel):
    icebreakers: List[str]

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/embeddings", response_model=EmbeddingResponse)
def generate_embedding(request: EmbeddingRequest):
    try:
        client = get_openai_client()
        response = client.embeddings.create(
            input=request.text,
            model="text-embedding-3-small"
        )
        return {"embedding": response.data[0].embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain-match", response_model=MatchExplanationResponse)
def explain_match(request: MatchRequest):
    try:
        client = get_openai_client()
        p1 = request.profile1
        p2 = request.profile2
        
        skills1 = ", ".join(p1.skills)
        interests1 = ", ".join(p1.interests)
        goals1 = ", ".join(p1.goals)
        
        skills2 = ", ".join(p2.skills)
        interests2 = ", ".join(p2.interests)
        goals2 = ", ".join(p2.goals)
        
        prompt = (
            f"Profile 1:\nName: {p1.name}\nSkills: {skills1}\nInterests: {interests1}\nGoals: {goals1}\n\n"
            f"Profile 2:\nName: {p2.name}\nSkills: {skills2}\nInterests: {interests2}\nGoals: {goals2}\n\n"
            "Explain in 1 or 2 warm, natural sentences why these two attendees should connect at the networking event. "
            "Focus on shared interests, complementary skills, or mutual startup/hackathon goals."
        )
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a warm, intelligent networking coach. Generate concise, highly personalized match explanations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100
        )
        explanation = completion.choices[0].message.content.strip()
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-icebreakers", response_model=IcebreakerResponse)
def generate_icebreakers(request: MatchRequest):
    try:
        client = get_openai_client()
        p1 = request.profile1
        p2 = request.profile2
        
        skills1 = ", ".join(p1.skills)
        interests1 = ", ".join(p1.interests)
        goals1 = ", ".join(p1.goals)
        
        skills2 = ", ".join(p2.skills)
        interests2 = ", ".join(p2.interests)
        goals2 = ", ".join(p2.goals)
        
        prompt = (
            f"Profile 1:\nName: {p1.name}\nSkills: {skills1}\nInterests: {interests1}\nGoals: {goals1}\n\n"
            f"Profile 2:\nName: {p2.name}\nSkills: {skills2}\nInterests: {interests2}\nGoals: {goals2}\n\n"
            "Generate 3 personalized, engaging conversation starters / icebreakers that Profile 1 could use to start a conversation with Profile 2. "
            "Make them feel natural, low-pressure, and highly specific to their overlapping interests. Return exactly 3 items as a plain text list separated by newlines, with no numbering."
        )
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a friendly, encouraging networking coach. Generate natural conversation starters."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        lines = [line.strip() for line in completion.choices[0].message.content.strip().split("\n") if line.strip()]
        cleaned_lines = []
        for line in lines:
            cleaned = line.lstrip("0123456789.-*• ")
            if cleaned:
                cleaned_lines.append(cleaned)
        return {"icebreakers": cleaned_lines[:3]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
