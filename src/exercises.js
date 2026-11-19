const exercises = [
{"zh":"虽然这个工作很有挑战性，但我从中学到了很多东西。","en":"Although this job is challenging, I have learned a lot from it.","gentleHint":"Notice the contrast between the difficulty of the job and what the speaker gained.","hint":"Use one contrast connector: “although” at the start or “but” between the ideas, not both for the same pair of clauses."},
{"zh":"只要你每天坚持练习，你的英语就会逐渐进步。","en":"As long as you keep practicing every day, your English will gradually improve.","gentleHint":"Which part gives the condition, and which part gives the result?","hint":"“As long as” can introduce the condition; keep “every day” with the practice and use “gradually” for the improvement."},
{"zh":"与其担心犯错，不如把它当作学习的机会。","en":"Instead of worrying about making mistakes, see them as opportunities to learn.","gentleHint":"The sentence recommends a helpful response to mistakes instead of worrying about them.","hint":"“Instead of” takes an -ing form; “see them as” can introduce the alternative way to view mistakes."},
{"zh":"这本书让我对不同的文化有了更深入的了解。","en":"This book has given me a deeper understanding of different cultures.","gentleHint":"Focus on how the book changed the depth of the speaker’s understanding.","hint":"“Give someone a deeper understanding of” links the book’s effect to the cultures being understood."},
{"zh":"我原以为这很困难，结果比想象中容易。","en":"I thought it would be difficult, but it turned out to be easier than I expected.","gentleHint":"Separate the speaker’s original expectation from what actually happened.","hint":"“Turned out to be” introduces the actual result; “than I expected” completes the comparison."}
];
const additionalExercises = [
  {
    "zh": "我通常在上班的路上听英语播客。",
    "en": "I usually listen to English podcasts on my way to work.",
    "gentleHint": "The listening happens regularly during the journey to work.",
    "hint": "Use the simple present for the habit; “on my way to work” places the listening during the commute."
  },
  {
    "zh": "今天早上我差点错过了公交车。",
    "en": "I almost missed the bus this morning.",
    "gentleHint": "The speaker caught the bus, but came very close to missing it.",
    "hint": "Put “almost” before the past-tense action; it means the missed bus did not actually happen."
  },
  {
    "zh": "你能告诉我最近的地铁站在哪里吗？",
    "en": "Could you tell me where the nearest subway station is?",
    "gentleHint": "A polite question contains another question about the station’s location.",
    "hint": "After “Could you tell me”, use statement order in the embedded question: question word, subject, then verb."
  },
  {
    "zh": "由于下雨，我们决定把野餐推迟到下周。",
    "en": "Because of the rain, we decided to postpone the picnic until next week.",
    "gentleHint": "Connect the rain to the decision, and make the new picnic date clear.",
    "hint": "“Because of” takes a noun phrase; “postpone … until” connects an activity to its new date."
  },
  {
    "zh": "我已经很久没有和大学朋友见面了。",
    "en": "I haven't seen my college friends in a long time.",
    "gentleHint": "The sentence describes a long period without seeing friends, continuing up to now.",
    "hint": "The present perfect negative fits this continuing absence; “in a long time” expresses its duration."
  },
  {
    "zh": "如果明天天气好，我们就去爬山。",
    "en": "If the weather is good tomorrow, we'll go hiking.",
    "gentleHint": "Distinguish tomorrow’s weather condition from the plan that depends on it.",
    "hint": "In this future conditional, use the present tense after “if”; “go hiking” expresses the planned activity."
  },
  {
    "zh": "请在离开之前把所有的灯关掉。",
    "en": "Please turn off all the lights before you leave.",
    "gentleHint": "Make clear that switching off the lights must happen before departure.",
    "hint": "“Turn off” is the action; after “before”, either give a subject and verb or use an -ing form."
  },
  {
    "zh": "我正在找一家安静又不太贵的咖啡馆。",
    "en": "I'm looking for a quiet café that isn't too expensive.",
    "gentleHint": "The cafe needs to meet two requirements: low noise and an affordable price.",
    "hint": "“Look for” expresses the search; describe the cafe with “quiet” and a clause such as “that isn’t too expensive”."
  },
  {
    "zh": "这家餐厅的食物没有我想象的那么好。",
    "en": "The food at this restaurant isn't as good as I expected.",
    "gentleHint": "The food falls short of the speaker’s expectations rather than being compared with another restaurant.",
    "hint": "Use “not as … as” for the unequal comparison, with an expectation clause after the second “as”."
  },
  {
    "zh": "我们最好提前订票，以免到时候没有座位。",
    "en": "We'd better book tickets in advance in case there are no seats left.",
    "gentleHint": "The advice to book early is meant to protect against seats becoming unavailable.",
    "hint": "“Had better” takes a base verb; “in advance” expresses early booking and “in case” introduces the possible problem."
  },
  {
    "zh": "我花了半个小时才找到丢失的钥匙。",
    "en": "It took me half an hour to find my lost keys.",
    "gentleHint": "Focus on the time spent finding the keys, not on the length of time they were missing.",
    "hint": "“It took someone + time + to + verb” expresses how long a task required."
  },
  {
    "zh": "她一到家就开始准备晚饭。",
    "en": "She started preparing dinner as soon as she got home.",
    "gentleHint": "The dinner preparation begins immediately after she reaches home.",
    "hint": "“As soon as” links the closely timed actions; use past-tense verbs for both events here."
  },
  {
    "zh": "我以前不喜欢跑步，但现在每周跑三次。",
    "en": "I didn't use to like running, but now I run three times a week.",
    "gentleHint": "Contrast the speaker’s former attitude toward running with the current routine.",
    "hint": "Use “didn’t use to” for the past state; “three times a week” describes the current frequency."
  },
  {
    "zh": "你介意把窗户打开一点吗？",
    "en": "Would you mind opening the window a little?",
    "gentleHint": "Make the request polite and include that the window should open only slightly.",
    "hint": "“Would you mind” takes an -ing form; “a little” can specify the small amount."
  },
  {
    "zh": "我们应该尽量减少一次性塑料的使用。",
    "en": "We should try to reduce our use of single-use plastic.",
    "gentleHint": "The goal is to reduce use of disposable plastic, not necessarily eliminate all plastic.",
    "hint": "“Single-use plastic” names the material; “reduce our use of” expresses the desired decrease."
  },
  {
    "zh": "这件外套很适合你，而且价格也合理。",
    "en": "This coat suits you well, and the price is reasonable too.",
    "gentleHint": "The coat looks good on the listener, and its cost is another positive point.",
    "hint": "“Suit someone” describes how clothing looks on a person; “reasonable” can describe the price."
  },
  {
    "zh": "我还没有决定周末要做什么。",
    "en": "I haven't decided what to do this weekend yet.",
    "gentleHint": "The weekend activity is still undecided at the present moment.",
    "hint": "The present perfect negative works with “yet”; “what to do” can follow “decide”."
  },
  {
    "zh": "他答应会在星期五之前把报告发给我。",
    "en": "He promised to send me the report by Friday.",
    "gentleHint": "The report must reach the speaker no later than Friday.",
    "hint": "“Promise to + verb” expresses the commitment; “by Friday” sets a deadline rather than an exact delivery day."
  },
  {
    "zh": "为了赶上早班飞机，我们必须凌晨四点出发。",
    "en": "We have to leave at four in the morning to catch the early flight.",
    "gentleHint": "Explain why leaving at four in the morning is necessary.",
    "hint": "Use “to + verb” to introduce the purpose of leaving; “catch a flight” is the natural travel expression."
  },
  {
    "zh": "即使很忙，我也会每天给父母打电话。",
    "en": "Even when I'm busy, I call my parents every day.",
    "gentleHint": "Being busy does not interrupt the speaker’s daily contact with their parents.",
    "hint": "“Even when” can introduce the busy situation; use the simple present for the daily habit."
  },
  {
    "zh": "我发现早睡能让我第二天更有精神。",
    "en": "I've found that going to bed early gives me more energy the next day.",
    "gentleHint": "Treat going to bed early as the habit that improves energy the following day.",
    "hint": "An -ing phrase can name the helpful habit; “the next day” refers to the day after that bedtime."
  },
  {
    "zh": "这条路正在维修，所以我们得绕道走。",
    "en": "This road is being repaired, so we have to take a detour.",
    "gentleHint": "The road is undergoing work now, forcing a change of route.",
    "hint": "Use “is being + past participle” for the ongoing repair; “take a detour” names the alternative route."
  },
  {
    "zh": "请提醒我下班后去取包裹。",
    "en": "Please remind me to pick up the package after work.",
    "gentleHint": "The request is for a reminder about collecting something after work.",
    "hint": "Use “remind someone to + verb”; “pick up” can mean collect a parcel."
  },
  {
    "zh": "我宁愿在家做饭，也不想出去吃。",
    "en": "I'd rather cook at home than eat out.",
    "gentleHint": "The speaker prefers one activity over another rather than simply listing two options.",
    "hint": "Use “would rather” with a base verb and “than” before the alternative activity, also in its base form."
  },
  {
    "zh": "她总是能把复杂的问题解释得很清楚。",
    "en": "She can always explain complicated problems clearly.",
    "gentleHint": "Distinguish the complexity of the problems from the clarity of her explanation.",
    "hint": "“Complicated” describes the problems; “clearly” is an adverb describing how she explains them."
  },
  {
    "zh": "我们需要更多时间来比较这两个方案。",
    "en": "We need more time to compare these two options.",
    "gentleHint": "The group needs extra time specifically for weighing two possible plans.",
    "hint": "“Time to + verb” expresses the task the time is needed for; “compare” directly takes the two options as its object."
  },
  {
    "zh": "这个项目比我们预期的花费更高。",
    "en": "This project costs more than we expected.",
    "gentleHint": "Compare the project’s actual cost with the amount the group expected.",
    "hint": "“Cost more than” expresses the comparison; use a past-tense expectation clause after “than”."
  },
  {
    "zh": "如果你有任何问题，随时联系我。",
    "en": "If you have any questions, feel free to contact me.",
    "gentleHint": "The second part warmly invites contact if the listener needs help.",
    "hint": "“Feel free to + verb” is a friendly invitation; “any questions” fits the conditional clause."
  },
  {
    "zh": "会议结束后，我会整理笔记并发给大家。",
    "en": "After the meeting, I'll organize my notes and send them to everyone.",
    "gentleHint": "The speaker plans two actions after the meeting, with the notes as their shared object.",
    "hint": "Keep “organize” and “send” parallel after “will”; use a pronoun to refer back to the notes in the second action."
  },
  {
    "zh": "他没有直接回答我的问题，而是换了个话题。",
    "en": "He didn't answer my question directly; instead, he changed the subject.",
    "gentleHint": "He avoids the question by directing the conversation toward something else.",
    "hint": "“Change the subject” means switch topics; “instead” can mark the action that replaces answering."
  },
  {
    "zh": "我很感谢你在我最需要的时候帮助了我。",
    "en": "I'm grateful that you helped me when I needed it most.",
    "gentleHint": "Connect the speaker’s gratitude to help received at a particularly important moment.",
    "hint": "“Be grateful that” can introduce the help received; “when I needed it most” identifies the timing."
  },
  {
    "zh": "学会倾听和表达自己的想法同样重要。",
    "en": "Learning to listen is just as important as expressing your own ideas.",
    "gentleHint": "The two communication abilities are presented as equally important.",
    "hint": "“Just as … as” expresses equality; use -ing phrases to name the activities being compared."
  },
  {
    "zh": "我们不应该根据一个人的外表来评价他。",
    "en": "We shouldn't judge someone by their appearance.",
    "gentleHint": "Appearance is the basis for judgment that the sentence warns against.",
    "hint": "“Judge someone by” introduces the basis of a judgment; “shouldn’t” makes this advice negative."
  },
  {
    "zh": "这个决定可能会对我们的生活产生长期影响。",
    "en": "This decision could have a long-term impact on our lives.",
    "gentleHint": "The possible effect of the decision extends far into the future.",
    "hint": "“Have an impact on” links an effect to what it affects; “long-term” describes its duration."
  },
  {
    "zh": "我越了解这个城市，就越喜欢这里。",
    "en": "The more I learn about this city, the more I like it.",
    "gentleHint": "Two things increase together: knowledge of the city and affection for it.",
    "hint": "The paired pattern “the more …, the more …” expresses this linked change."
  },
  {
    "zh": "她不仅完成了自己的任务，还帮助了其他同事。",
    "en": "She not only finished her own tasks but also helped her colleagues.",
    "gentleHint": "Her help for colleagues comes in addition to completing her own responsibilities.",
    "hint": "“Not only … but also …” links the two contributions; keep their verb phrases parallel."
  },
  {
    "zh": "在做决定之前，我们应该听听不同的意见。",
    "en": "Before making a decision, we should listen to different opinions.",
    "gentleHint": "Hearing a range of views should come before reaching a decision.",
    "hint": "“Before + -ing” can introduce the first step; remember the preposition in “listen to”."
  },
  {
    "zh": "我希望将来能有机会在国外生活一段时间。",
    "en": "I hope to have the opportunity to live abroad for a while someday.",
    "gentleHint": "The speaker hopes for a future opportunity to live abroad temporarily.",
    "hint": "Use “an opportunity to + verb” for the chance; “for a while” describes the temporary stay."
  },
  {
    "zh": "失败并不意味着你没有能力。",
    "en": "Failure doesn't mean you're incapable.",
    "gentleHint": "The sentence rejects a negative conclusion someone might draw from failure.",
    "hint": "“Doesn’t mean” separates the event from the conclusion; “incapable” is one way to express lacking ability."
  },
  {
    "zh": "重要的不是你学得多快，而是你是否坚持。",
    "en": "What matters is not how fast you learn, but whether you keep going.",
    "gentleHint": "Contrast learning speed with persistence as the more important consideration.",
    "hint": "“What matters” can introduce the point; “not … but …” contrasts the two criteria, and “whether” introduces persistence."
  },
  {
    "zh": "我们原计划坐火车，但最后决定开车。",
    "en": "We originally planned to take the train, but decided to drive in the end.",
    "gentleHint": "The group’s original travel plan differs from its final choice.",
    "hint": "“Planned to” introduces the original intention; “in the end” marks the eventual decision."
  },
  {
    "zh": "这部电影让我想起了自己的童年。",
    "en": "This movie reminded me of my childhood.",
    "gentleHint": "The film brings the speaker’s own childhood back to mind.",
    "hint": "“Remind someone of” links a trigger to a memory; use a past-tense verb for the film’s effect here."
  },
  {
    "zh": "我已经习惯了在新的城市独自生活。",
    "en": "I've gotten used to living alone in a new city.",
    "gentleHint": "Living alone in the new city now feels familiar to the speaker.",
    "hint": "“Have gotten used to” expresses becoming accustomed to something; “to” here takes an -ing form, not a base verb."
  },
  {
    "zh": "你不必马上回答，可以先考虑一下。",
    "en": "You don't have to answer right away; you can think about it first.",
    "gentleHint": "The listener has permission to think before responding, rather than a duty to answer now.",
    "hint": "“Don’t have to” removes an obligation; “right away” means immediately."
  },
  {
    "zh": "如果我早点出门，就不会迟到了。",
    "en": "If I had left earlier, I wouldn't have been late.",
    "gentleHint": "Both the earlier departure and avoiding lateness are imagined alternatives to past events.",
    "hint": "Use “if + had + past participle” with “would have + past participle” for an unreal past result."
  },
  {
    "zh": "我刚准备出门，电话就响了。",
    "en": "I was just about to leave when the phone rang.",
    "gentleHint": "The phone interrupts the moment just before the speaker leaves.",
    "hint": "“Was about to + verb” describes the imminent action; “when” can introduce the interrupting past event."
  },
  {
    "zh": "无论结果如何，我都为自己的努力感到骄傲。",
    "en": "Whatever the outcome, I'm proud of the effort I've put in.",
    "gentleHint": "The speaker values the effort independently of how things turn out.",
    "hint": "“Whatever the outcome” removes the result as a condition; “proud of” introduces what the speaker values."
  },
  {
    "zh": "我们需要在工作和休息之间找到平衡。",
    "en": "We need to find a balance between work and rest.",
    "gentleHint": "The aim is a suitable relationship between work and rest, not choosing only one.",
    "hint": "“Find a balance between” introduces one side; use “and” to introduce the other."
  },
  {
    "zh": "这份工作需要耐心，也需要良好的沟通能力。",
    "en": "This job requires both patience and good communication skills.",
    "gentleHint": "The job calls for a personal quality as well as an ability to communicate.",
    "hint": "“Both … and …” joins the requirements; “communication skills” is the usual expression for that ability."
  },
  {
    "zh": "我没想到一个小小的改变会带来这么大的不同。",
    "en": "I didn't expect such a small change to make such a big difference.",
    "gentleHint": "The surprise comes from the large effect of a very small change.",
    "hint": "“Expect + object + to + verb” describes the expectation; “make a difference” expresses the effect."
  },
  {
    "zh": "他建议我们先做一些调查，再开始这个项目。",
    "en": "He suggested doing some research before starting the project.",
    "gentleHint": "Research is proposed as a first step before work on the project begins.",
    "hint": "“Suggest doing” can introduce the proposal; use “before + -ing” to show the order of activities."
  },
  {
    "zh": "我正在努力减少花在手机上的时间。",
    "en": "I'm trying to cut down on the time I spend on my phone.",
    "gentleHint": "The speaker is trying to reduce the amount of time devoted to phone use.",
    "hint": "“Cut down on” means reduce; a clause after “the time” can describe how that time is spent."
  },
  {
    "zh": "与网上购物相比，我更喜欢去实体店。",
    "en": "I prefer shopping in physical stores to shopping online.",
    "gentleHint": "The preference compares shopping in physical stores with shopping online.",
    "hint": "Use “prefer … to …”; matching -ing phrases can name the two shopping activities."
  },
  {
    "zh": "这个应用让我更容易记录每天的开支。",
    "en": "This app makes it easier for me to track my daily expenses.",
    "gentleHint": "The app makes a daily money-management task easier for the speaker.",
    "hint": "“Make it easier for someone to + verb” expresses the benefit; “track expenses” names the task."
  },
  {
    "zh": "我忘记带充电器了，手机快没电了。",
    "en": "I forgot to bring my charger, and my phone is running out of battery.",
    "gentleHint": "A forgotten charger is a past problem, while the battery is becoming empty now.",
    "hint": "Use a past-tense verb for forgetting; “is running out of” describes a supply becoming exhausted now."
  },
  {
    "zh": "你能帮我检查一下这封邮件有没有语法错误吗？",
    "en": "Could you help me check this email for grammatical errors?",
    "gentleHint": "The speaker asks someone to inspect an email for a particular type of mistake.",
    "hint": "“Check something for” introduces the problem being sought; “grammatical errors” names that problem."
  },
  {
    "zh": "她说话很轻，所以我几乎听不清。",
    "en": "She spoke so quietly that I could barely hear her.",
    "gentleHint": "Her low speaking volume causes difficulty hearing her.",
    "hint": "“So + adverb + that” can link the quiet speech to its result; “barely” means almost not."
  },
  {
    "zh": "我需要一张靠窗的桌子，这样光线会好一些。",
    "en": "I need a table by the window so that I'll have better light.",
    "gentleHint": "The preferred table location is connected to the benefit of better lighting.",
    "hint": "“By the window” describes the location; “so that” can introduce the desired lighting benefit."
  },
  {
    "zh": "这双鞋穿起来很舒服，适合长时间走路。",
    "en": "These shoes are comfortable and suitable for long walks.",
    "gentleHint": "Describe both how the shoes feel and the type of activity they are good for.",
    "hint": "“Comfortable” describes the feeling; “suitable for” introduces the activity the shoes fit."
  },
  {
    "zh": "我们到达车站时，火车已经开走了。",
    "en": "By the time we arrived at the station, the train had already left.",
    "gentleHint": "Put the train’s departure earlier than the group’s arrival.",
    "hint": "The past perfect marks the earlier event; “by the time” can introduce the later arrival."
  },
  {
    "zh": "这次旅行最让我难忘的是当地人的热情。",
    "en": "What I remember most about this trip is the warmth of the local people.",
    "gentleHint": "Identify the single feature of the trip that stands out most in memory.",
    "hint": "A “What … most” clause can introduce that feature; “warmth” can describe the local people’s friendliness."
  },
  {
    "zh": "我想预订一个可以免费取消的房间。",
    "en": "I'd like to book a room with free cancellation.",
    "gentleHint": "Think about how to describe a room with a cancellation option.",
    "hint": "Use “book” or “reserve” for 预订; “free cancellation” expresses the condition attached to the room."
  },
  {
    "zh": "你知道这张票是否包含行李费用吗？",
    "en": "Do you know whether this ticket includes baggage fees?",
    "gentleHint": "The question asks whether a ticket price covers a particular extra charge.",
    "hint": "“Whether” or “if” can introduce the embedded question; “includes baggage fees” describes the possible coverage."
  },
  {
    "zh": "我们迷路了，幸好有人帮我们指路。",
    "en": "We got lost, but luckily someone gave us directions.",
    "gentleHint": "Someone’s help resolves the group’s problem of not knowing the route.",
    "hint": "“Get lost” describes the problem; “give someone directions” describes the help."
  },
  {
    "zh": "这家博物馆每周一不对外开放。",
    "en": "This museum is closed to the public every Monday.",
    "gentleHint": "The closure is a regular weekly rule applying to visitors.",
    "hint": "“Closed to the public” describes visitor access; “every Monday” expresses the recurring day."
  },
  {
    "zh": "我想尝试当地的食物，而不是只去熟悉的餐厅。",
    "en": "I'd like to try local food instead of only going to familiar restaurants.",
    "gentleHint": "Contrast trying local dishes with sticking only to familiar places to eat.",
    "hint": "“Instead of” introduces the alternative being avoided; use an -ing form after this preposition."
  },
  {
    "zh": "请问走到海边大约需要多长时间？",
    "en": "Excuse me, about how long does it take to walk to the beach?",
    "gentleHint": "Ask about the time needed for walking to a destination, not the distance itself.",
    "hint": "“How long does it take to + verb?” asks about duration; “about” makes the requested estimate approximate."
  },
  {
    "zh": "我们应该给自己留出足够的转机时间。",
    "en": "We should allow ourselves enough time for the connection.",
    "gentleHint": "The group needs to plan sufficient time between flights.",
    "hint": "“Allow enough time for” expresses planning sufficient time; “connection” can refer to the transfer between flights."
  },
  {
    "zh": "我把护照放在包里了，但现在找不到。",
    "en": "I put my passport in my bag, but I can't find it now.",
    "gentleHint": "Separate where the passport was placed earlier from the speaker’s inability to locate it now.",
    "hint": "Use the simple past for placing it and “can’t find” for the current problem; “put” has the same present and past form."
  },
  {
    "zh": "虽然旅途很累，但沿途的风景非常值得。",
    "en": "Although the journey was tiring, the scenery along the way made it worthwhile.",
    "gentleHint": "The scenery compensates for the effort of a tiring journey.",
    "hint": "“Although” can introduce the drawback; “make it worthwhile” expresses why the experience was worth the effort."
  },
  {
    "zh": "我想学习如何更清楚地表达自己的观点。",
    "en": "I want to learn how to express my opinions more clearly.",
    "gentleHint": "The learning goal is clearer expression of the speaker’s own views.",
    "hint": "“Learn how to + verb” introduces the skill; “express my opinions” names it, with “more clearly” describing the improvement."
  },
  {
    "zh": "每次遇到生词，我都会先根据上下文猜意思。",
    "en": "Whenever I come across an unfamiliar word, I first try to guess its meaning from the context.",
    "gentleHint": "The speaker first uses the surrounding text to infer an unfamiliar word’s meaning.",
    "hint": "“Whenever” expresses the repeated situation; “guess its meaning from the context” describes the first strategy."
  },
  {
    "zh": "与其死记单词，不如把它们放在句子里练习。",
    "en": "Instead of memorizing words mechanically, practice using them in sentences.",
    "gentleHint": "The advice favors practicing vocabulary in context over memorizing it mechanically.",
    "hint": "After “instead of”, use an -ing form; “practice using” introduces the recommended way to work with the words."
  },
  {
    "zh": "我能看懂大部分内容，但说起来还不够流利。",
    "en": "I can understand most of the content, but I'm still not very fluent when I speak.",
    "gentleHint": "Contrast stronger reading comprehension with weaker spoken fluency.",
    "hint": "“Most of the content” describes what is understood; “not very fluent when I speak” can qualify the speaking ability."
  },
  {
    "zh": "你能说慢一点，让我记下来吗？",
    "en": "Could you speak a little more slowly so I can write it down?",
    "gentleHint": "The listener is asked to slow down so the speaker has time to make notes.",
    "hint": "“More slowly” describes the requested change; “write it down” means record the information in writing."
  },
  {
    "zh": "这个词在正式和非正式场合的用法不同。",
    "en": "This word is used differently in formal and informal situations.",
    "gentleHint": "The same word changes its use depending on how formal the situation is.",
    "hint": "A passive form such as “is used” fits the focus on usage; “formal and informal situations” names the contrast."
  },
  {
    "zh": "我最近开始用英语写日记。",
    "en": "I've recently started keeping a diary in English.",
    "gentleHint": "The speaker has recently begun a continuing habit of writing in English.",
    "hint": "“Start keeping a diary” names the habit; the present perfect can connect its recent beginning with now."
  },
  {
    "zh": "如果只看答案而不自己练习，就很难真正进步。",
    "en": "It's hard to make real progress if you only look at the answers without practicing yourself.",
    "gentleHint": "The sentence warns that seeing answers alone cannot replace doing the work yourself.",
    "hint": "“Without + -ing” expresses the missing activity; “make progress” describes the desired improvement."
  },
  {
    "zh": "我想先自己试一下，然后再看参考答案。",
    "en": "I'd like to try it myself first and then look at the reference answer.",
    "gentleHint": "The speaker wants an independent attempt before checking the model response.",
    "hint": "Use “first” and “then” to order the actions; “myself” emphasizes the independent attempt."
  },
  {
    "zh": "你能举个例子说明这两个词的区别吗？",
    "en": "Could you give an example to explain the difference between these two words?",
    "gentleHint": "The requested example should clarify how two words differ.",
    "hint": "“Give an example” expresses the request; “the difference between these two words” names what it should explain."
  },
  {
    "zh": "我答应自己每天至少练习十分钟。",
    "en": "I promised myself I would practice for at least ten minutes every day.",
    "gentleHint": "The speaker made a personal commitment with a minimum daily practice duration.",
    "hint": "“Promise myself” expresses the commitment; use “for at least” before the minimum duration."
  },
  {
    "zh": "我们应该把大目标分成几个容易完成的小任务。",
    "en": "We should break big goals down into smaller, manageable tasks.",
    "gentleHint": "The advice is to turn an ambitious goal into smaller achievable pieces.",
    "hint": "“Break … down into” describes dividing a goal; “manageable” describes tasks that are practical to finish."
  },
  {
    "zh": "我发现把通知关掉以后更容易集中注意力。",
    "en": "I've found it easier to concentrate after turning off notifications.",
    "gentleHint": "Turning off alerts is the change that improves the speaker’s concentration.",
    "hint": "“Find it easier to + verb” expresses the improvement; “after + -ing” links it to disabling notifications."
  },
  {
    "zh": "不要因为一天没有进步就放弃整个计划。",
    "en": "Don't give up on the whole plan just because you haven't made progress for one day.",
    "gentleHint": "A single day without progress is not a reason to abandon the larger effort.",
    "hint": "“Give up on” expresses abandoning the plan; “just because” can introduce the insufficient reason."
  },
  {
    "zh": "她用了几个月的时间养成了每天阅读的习惯。",
    "en": "It took her a few months to develop the habit of reading every day.",
    "gentleHint": "Distinguish the months needed to establish the habit from the daily reading itself.",
    "hint": "“It took her + time + to + verb” expresses the development period; “the habit of + -ing” names the habit."
  },
  {
    "zh": "我希望下个月能比现在更有信心。",
    "en": "I hope I'll feel more confident next month than I do now.",
    "gentleHint": "Compare the speaker’s hoped-for confidence next month with their confidence now.",
    "hint": "Use “more confident” for the comparison; “than I do now” can refer back to the current feeling."
  },
  {
    "zh": "只要方法合适，短时间的练习也能有效果。",
    "en": "As long as you use the right approach, even short practice sessions can be effective.",
    "gentleHint": "Brief practice can still help, provided the method is suitable.",
    "hint": "“As long as” introduces the condition; “effective” describes practice that produces results."
  },
  {
    "zh": "休息并不是浪费时间，而是为了更好地继续。",
    "en": "Resting isn't a waste of time; it helps you carry on more effectively.",
    "gentleHint": "Rest is presented as helping future effort rather than as wasted time.",
    "hint": "“A waste of time” names the rejected view; “carry on more effectively” expresses the benefit."
  },
  {
    "zh": "我正在学习接受自己不可能事事完美。",
    "en": "I'm learning to accept that I can't be perfect at everything.",
    "gentleHint": "The speaker is learning to accept a limit on their own perfection.",
    "hint": "“Accept that” introduces what must be acknowledged; “perfect at everything” expresses the unrealistic standard."
  },
  {
    "zh": "当任务太多时，我会先列出最重要的三件事。",
    "en": "When I have too many tasks, I start by listing the three most important ones.",
    "gentleHint": "When overloaded, the speaker begins by identifying only the top three priorities.",
    "hint": "“Start by + -ing” introduces the first step; “the three most important” selects the priorities."
  },
  {
    "zh": "我们不能控制一切，但可以选择如何回应。",
    "en": "We can't control everything, but we can choose how to respond.",
    "gentleHint": "Contrast what lies outside our control with the response we can choose.",
    "hint": "“Can’t … but can …” marks the contrast; “how to respond” names the choice that remains."
  },
  {
    "zh": "这段经历让我明白了耐心的重要性。",
    "en": "This experience taught me the importance of patience.",
    "gentleHint": "The experience led to an understanding of why patience matters.",
    "hint": "“Teach someone the importance of” links an experience to the lesson learned."
  },
  {
    "zh": "如果有机会重新开始，我还是会做同样的选择。",
    "en": "If I had the chance to start over, I would make the same choice.",
    "gentleHint": "Imagine another chance to begin while keeping the speaker’s choice unchanged.",
    "hint": "Use “if + past tense” with “would + base verb” for this hypothetical choice; “start over” means begin again."
  },
  {
    "zh": "有时候，问一个好问题比立刻给出答案更有帮助。",
    "en": "Sometimes asking a good question is more helpful than giving an immediate answer.",
    "gentleHint": "Compare the usefulness of asking thoughtfully with answering immediately.",
    "hint": "Compare two -ing phrases using “more helpful than”; “immediate” can describe the answer."
  },
  {
    "zh": "我还在学习，但我已经比昨天更进一步了。",
    "en": "I'm still learning, but I've already taken another step forward since yesterday.",
    "gentleHint": "The speaker acknowledges ongoing learning while recognizing progress since yesterday.",
    "hint": "“Still” marks the ongoing learning; “take a step forward” expresses progress, and “since yesterday” links it to the present."
  }
];

export default [...exercises, ...additionalExercises];
