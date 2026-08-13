import requests

forms = [
  {
    'id': 'form_mock_001',
    'title': 'Customer Feedback Survey',
    'status': 'published',
    'share_id': 'share_cfs_2026',
    'thumbnail_color': '#C68642',
    'questions': [
      {
        'id': 'q_001',
        'type': 'short_text',
        'title': 'What is your name?',
        'index': 0,
        'settings': { 'required': True, 'description': 'Please enter your full name.' },
        'type_settings': {},
        'options': []
      },
      {
        'id': 'q_002',
        'parent_id': 'q_001',
        'type': 'email',
        'title': 'What is your email address?',
        'index': 1,
        'settings': { 'required': True, 'description': '' },
        'type_settings': {},
        'options': []
      },
      {
        'id': 'q_003',
        'parent_id': 'q_001',
        'type': 'multiple_choice',
        'title': 'Which products have you used?',
        'index': 2,
        'settings': {
          'required': False,
          'description': 'Select all that apply.',
        },
        'type_settings': {
          'allowMultipleSelection': True,
          'randomizeOptions': False,
          'hasOtherOption': True,
          'hasNoneOption': False,
          'verticalAlignment': True,
        },
        'options': [
          { 'id': 'opt_001', 'label': 'Starter Plan' },
          { 'id': 'opt_002', 'label': 'Pro Plan' },
          { 'id': 'opt_003', 'label': 'Enterprise' },
        ]
      },
      {
        'id': 'q_004',
        'parent_id': 'q_001',
        'type': 'rating',
        'title': 'How would you rate your overall experience?',
        'index': 3,
        'settings': { 'required': True, 'description': '1 = Poor, 5 = Excellent' },
        'type_settings': { 'ratingSteps': 5 },
        'options': []
      },
      {
        'id': 'q_005',
        'parent_id': 'q_001',
        'type': 'yes_no',
        'title': 'Would you recommend us to a friend?',
        'index': 4,
        'settings': { 'required': False, 'description': '' },
        'type_settings': {},
        'options': []
      },
      {
        'id': 'q_006',
        'parent_id': 'q_001',
        'type': 'long_text',
        'title': 'Any additional comments or suggestions?',
        'index': 5,
        'settings': {
          'required': False,
          'description': 'We read every response carefully.',
        },
        'type_settings': {},
        'options': []
      }
    ]
  },
  {
    'id': 'form_mock_002',
    'title': 'Product Onboarding',
    'status': 'draft',
    'share_id': None,
    'thumbnail_color': '#7C6F8E',
    'questions': [
      {
        'id': 'q_101',
        'type': 'short_text',
        'title': 'What is your role?',
        'index': 0,
        'settings': { 'required': True, 'description': 'e.g. Designer, Engineer, Product Manager' },
        'type_settings': {},
        'options': []
      },
      {
        'id': 'q_102',
        'parent_id': 'q_101',
        'type': 'dropdown',
        'title': 'Which industry do you work in?',
        'index': 1,
        'settings': { 'required': False, 'description': '' },
        'type_settings': { 'randomizeOptions': False },
        'options': [
          { 'id': 'opt_101', 'label': 'Technology' },
          { 'id': 'opt_102', 'label': 'Healthcare' },
          { 'id': 'opt_103', 'label': 'Finance' },
          { 'id': 'opt_104', 'label': 'Education' },
          { 'id': 'opt_105', 'label': 'Other' },
        ]
      },
      {
        'id': 'q_103',
        'parent_id': 'q_101',
        'type': 'number',
        'title': 'How large is your company?',
        'index': 2,
        'settings': { 'required': False, 'description': 'Enter the total number of employees' },
        'type_settings': {},
        'options': []
      }
    ]
  }
]

url = 'https://typeform-api-vk-dad5apf6fvbbaehs.centralindia-01.azurewebsites.net/api/forms'
for form in forms:
    # First create
    res = requests.post(url, json=form)
    print("POST", res.status_code)
    # Then update to attach questions
    res2 = requests.put(f"{url}/{form['id']}", json=form)
    print("PUT", res2.status_code)
