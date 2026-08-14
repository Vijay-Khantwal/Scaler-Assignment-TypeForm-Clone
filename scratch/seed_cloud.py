import requests
import json
import uuid

API_BASE = "https://typeform-api-vk-dad5apf6fvbbaehs.centralindia-01.azurewebsites.net/api"

def gen_id():
    return str(uuid.uuid4())[:10]

def main():
    # 1. Delete all forms
    print("Fetching forms to delete...")
    res = requests.get(f"{API_BASE}/forms")
    forms = res.json()
    for f in forms:
        print(f"Deleting form {f['id']} - {f['title']}")
        requests.delete(f"{API_BASE}/forms/{f['id']}")
        
    print("All forms deleted.")
    
    # 2. Create Form 1 (Short)
    print("Creating Form 1 (Event RSVP)...")
    f1_id = gen_id()
    f1 = requests.post(f"{API_BASE}/forms", json={"id": f1_id, "title": "Tech Meetup RSVP"}).json()
    
    f1_payload = {
        "id": f1_id,
        "title": "Tech Meetup RSVP",
        "settings": {"is_published": False},
        "questions": [
            {
                "id": gen_id(),
                "type": "short_text",
                "title": "What's your name?",
                "description": "So we can print your badge.",
                "order_index": 0,
                "settings": {"required": True},
                "typeSettings": {"maxLength": 50},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "dropdown",
                "title": "Meal Preference",
                "description": "",
                "order_index": 1,
                "settings": {"required": True},
                "typeSettings": {},
                "options": [
                    {"id": gen_id(), "label": "Vegetarian"},
                    {"id": gen_id(), "label": "Non-Vegetarian"},
                    {"id": gen_id(), "label": "Vegan"}
                ]
            },
            {
                "id": gen_id(),
                "type": "yes_no",
                "title": "Will you attend the afterparty?",
                "description": "Starts at 8 PM at the rooftop bar.",
                "order_index": 2,
                "settings": {"required": False},
                "typeSettings": {},
                "options": []
            }
        ]
    }
    requests.put(f"{API_BASE}/forms/{f1_id}", json=f1_payload)
    requests.post(f"{API_BASE}/forms/{f1_id}/publish")
    
    # 3. Create Form 2 (Medium)
    print("Creating Form 2 (Product Feedback)...")
    f2_id = gen_id()
    f2 = requests.post(f"{API_BASE}/forms", json={"id": f2_id, "title": "Product Feedback Survey"}).json()
    
    f2_payload = {
        "id": f2_id,
        "title": "Product Feedback Survey",
        "settings": {"is_published": False},
        "questions": [
            {
                "id": gen_id(),
                "type": "rating",
                "title": "How would you rate our product overall?",
                "description": "1 is terrible, 5 is amazing.",
                "order_index": 0,
                "settings": {"required": True},
                "typeSettings": {"steps": 5, "shape": "star"},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "multiple_choice",
                "title": "Which features do you use the most?",
                "description": "Select all that apply.",
                "order_index": 1,
                "settings": {"required": True},
                "typeSettings": {"allowMultipleSelection": True, "hasOtherOption": True},
                "options": [
                    {"id": gen_id(), "label": "Form Builder"},
                    {"id": gen_id(), "label": "Data Analytics"},
                    {"id": gen_id(), "label": "Team Collaboration"}
                ]
            },
            {
                "id": gen_id(),
                "type": "number",
                "title": "How many days a week do you use our product?",
                "description": "",
                "order_index": 2,
                "settings": {"required": False},
                "typeSettings": {"minValue": 0, "maxValue": 7},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "long_text",
                "title": "Any additional feedback or feature requests?",
                "description": "We read every single comment.",
                "order_index": 3,
                "settings": {"required": False},
                "typeSettings": {"maxLength": 500},
                "options": []
            }
        ]
    }
    requests.put(f"{API_BASE}/forms/{f2_id}", json=f2_payload)
    requests.post(f"{API_BASE}/forms/{f2_id}/publish")
    
    # 4. Create Form 3 (Long)
    print("Creating Form 3 (Job Application)...")
    f3_id = gen_id()
    f3 = requests.post(f"{API_BASE}/forms", json={"id": f3_id, "title": "Software Engineer Application"}).json()
    
    f3_payload = {
        "id": f3_id,
        "title": "Software Engineer Application",
        "settings": {"is_published": False},
        "questions": [
            {
                "id": gen_id(),
                "type": "short_text",
                "title": "Full Name",
                "description": "",
                "order_index": 0,
                "settings": {"required": True},
                "typeSettings": {},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "email",
                "title": "Email Address",
                "description": "We will use this to contact you.",
                "order_index": 1,
                "settings": {"required": True},
                "typeSettings": {},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "dropdown",
                "title": "Which role are you applying for?",
                "description": "",
                "order_index": 2,
                "settings": {"required": True},
                "typeSettings": {},
                "options": [
                    {"id": gen_id(), "label": "Frontend Engineer"},
                    {"id": gen_id(), "label": "Backend Engineer"},
                    {"id": gen_id(), "label": "Fullstack Engineer"}
                ]
            },
            {
                "id": gen_id(),
                "type": "multiple_choice",
                "title": "What programming languages are you proficient in?",
                "description": "Select up to 3.",
                "order_index": 3,
                "settings": {"required": True},
                "typeSettings": {"allowMultipleSelection": True},
                "options": [
                    {"id": gen_id(), "label": "JavaScript / TypeScript"},
                    {"id": gen_id(), "label": "Python"},
                    {"id": gen_id(), "label": "Go"},
                    {"id": gen_id(), "label": "Java"},
                    {"id": gen_id(), "label": "C++"}
                ]
            },
            {
                "id": gen_id(),
                "type": "number",
                "title": "Years of professional experience",
                "description": "Exclude internships.",
                "order_index": 4,
                "settings": {"required": True},
                "typeSettings": {"minValue": 0},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "rating",
                "title": "How confident are you with React?",
                "description": "1 = Beginner, 5 = Expert",
                "order_index": 5,
                "settings": {"required": True},
                "typeSettings": {"steps": 5},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "yes_no",
                "title": "Are you willing to relocate?",
                "description": "Our office is in San Francisco.",
                "order_index": 6,
                "settings": {"required": True},
                "typeSettings": {},
                "options": []
            },
            {
                "id": gen_id(),
                "type": "long_text",
                "title": "Why do you want to join our team?",
                "description": "Keep it under 300 words.",
                "order_index": 7,
                "settings": {"required": True},
                "typeSettings": {"maxLength": 2000},
                "options": []
            }
        ]
    }
    requests.put(f"{API_BASE}/forms/{f3_id}", json=f3_payload)
    published_f3 = requests.post(f"{API_BASE}/forms/{f3_id}/publish").json()
    
    # 5. Create some dummy submissions for Form 3
    print("Creating dummy submissions...")
    share_id = published_f3["shareId"]
    q_dict = {q["title"]: q["id"] for q in f3_payload["questions"]}
    
    sub1 = {
        "answers": [
            {"questionId": q_dict["Full Name"], "type": "short_text", "value": "Alice Johnson"},
            {"questionId": q_dict["Email Address"], "type": "email", "value": "alice@example.com"},
            {"questionId": q_dict["Which role are you applying for?"], "type": "dropdown", "value": "Frontend Engineer"},
            {"questionId": q_dict["Years of professional experience"], "type": "number", "value": 4},
            {"questionId": q_dict["How confident are you with React?"], "type": "rating", "value": 5},
            {"questionId": q_dict["Are you willing to relocate?"], "type": "yes_no", "value": True},
            {"questionId": q_dict["Why do you want to join our team?"], "type": "long_text", "value": "I love building intuitive user interfaces!"}
        ]
    }
    requests.post(f"{API_BASE}/public/forms/{share_id}/submissions", json=sub1)

    print("Done! Seeding completed successfully.")

if __name__ == "__main__":
    main()
