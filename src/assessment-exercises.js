// Each form covers concession, conditions, alternatives, past events, and polite requests.
export const assessmentBankVersion = 1;
export const assessmentForms = [
  [
    {zh:'虽然搬到新城市让我有些紧张，但我很期待认识新朋友。',en:"Although moving to a new city makes me a little nervous, I'm looking forward to making new friends."},
    {zh:'只要提前把材料准备好，我们就能按时完成演示。',en:'As long as we prepare the materials in advance, we can finish the presentation on time.'},
    {zh:'与其反复抱怨计划有变，不如一起想一个新的办法。',en:'Instead of repeatedly complaining about the change of plans, we should work together to find a new solution.'},
    {zh:'我到办公室时，其他人已经开始讨论客户的建议了。',en:"By the time I arrived at the office, the others had already started discussing the client's suggestions."},
    {zh:'你能告诉我是否需要提前报名参加这次活动吗？',en:'Could you tell me whether I need to register for this event in advance?'},
  ],
  [
    {zh:'虽然第一次演讲没有想象中顺利，但我比以前更有信心了。',en:"Although my first speech didn't go as smoothly as I had expected, I feel more confident than before."},
    {zh:'只要大家及时分享进度，我们就能避免重复工作。',en:'As long as everyone shares their progress promptly, we can avoid doing the same work twice.'},
    {zh:'与其一次安排太多任务，不如先完成最紧急的一项。',en:'Instead of scheduling too many tasks at once, we should finish the most urgent one first.'},
    {zh:'我们赶到电影院的时候，电影已经放映了十分钟。',en:'By the time we reached the cinema, the film had already been playing for ten minutes.'},
    {zh:'你能告诉我这份申请是否还需要其他文件吗？',en:'Could you tell me whether this application requires any additional documents?'},
  ],
  [
    {zh:'虽然这门课程需要花不少时间，但它让我学会了更有条理地思考。',en:'Although this course takes quite a lot of time, it has taught me to think in a more organized way.'},
    {zh:'只要把每一步解释清楚，新同事就能独立完成这项任务。',en:'As long as we explain each step clearly, our new colleague will be able to complete this task independently.'},
    {zh:'与其等到最后一天才开始，不如每天完成一点。',en:'Instead of waiting until the last day to start, we should do a little each day.'},
    {zh:'她回到会议室时，经理已经回答了大家的问题。',en:"By the time she returned to the meeting room, the manager had already answered everyone's questions."},
    {zh:'你能告诉我这张通行证是否可以在周末使用吗？',en:'Could you tell me whether this pass can be used on weekends?'},
  ],
  [
    {zh:'虽然新的软件一开始很难上手，但现在它帮我们节省了很多时间。',en:'Although the new software was difficult to use at first, it now saves us a lot of time.'},
    {zh:'只要认真核对地址，包裹就不容易寄错地方。',en:'As long as we check the address carefully, the package is unlikely to be sent to the wrong place.'},
    {zh:'与其急着给出结论，不如先确认我们掌握的信息是否完整。',en:'Instead of rushing to a conclusion, we should first check whether we have all the information.'},
    {zh:'我打开电脑时，同事已经把修改后的文件发过来了。',en:'By the time I turned on my computer, my colleague had already sent me the revised document.'},
    {zh:'你能告诉我参观期间是否允许拍照吗？',en:'Could you tell me whether taking photos is allowed during the visit?'},
  ],
];

export function selectAssessmentForm(results) {
  const seen = new Set(results.flatMap(result => (result.answers || []).map(answer => answer.zh)));
  return assessmentForms.find(form => form.every(item => !seen.has(item.zh))) ||
    assessmentForms[results.length % assessmentForms.length];
}
