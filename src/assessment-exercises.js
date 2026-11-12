// Independent transfer tasks. Each form balances linked ideas, time/aspect,
// reference or comparison, and practical instructions without mirroring Practice templates.
export const assessmentBankVersion = 2;
export const assessmentForms = [
  [
    {zh:'没有购物小票，这家商店就不给退货。',en:'This shop will not accept a return unless you have the receipt.'},
    {zh:'那块架子太窄了，放不下打印机。',en:'The shelf is too narrow for the printer to fit on it.'},
    {zh:'电梯和楼梯都无法通往屋顶。',en:'Neither the lift nor the stairs provides access to the roof.'},
    {zh:'牌子上写着，所有访客进入实验室都要佩戴证件。',en:'The sign says that all visitors must wear identification when entering the laboratory.'},
    {zh:'我的笔记本电脑还在维修，最快周四才能取回。',en:'My laptop is still being repaired, and Thursday is the earliest I can collect it.'},
  ],
  [
    {zh:'屋内的烟雾散去后，消防员才允许住户进去。',en:'The firefighters allowed the residents inside only after the smoke had cleared.'},
    {zh:'装着玻璃杯的箱子需要竖着搬，不能平放。',en:'The box containing the glasses needs to be carried upright and must not be laid flat.'},
    {zh:'这两张照片中，左边那张拍摄得更早。',en:'Of these two photographs, the one on the left was taken earlier.'},
    {zh:'所有借出的设备都必须在月底归还。',en:'All equipment that has been lent out must be returned by the end of the month.'},
    {zh:'住在楼下的邻居昨晚敲门，问那辆自行车是不是我的。',en:'The neighbour who lives downstairs knocked on my door last night and asked if the bicycle was mine.'},
  ],
  [
    {zh:'这张票一旦写上姓名，就不能转让给别人。',en:'Once a name has been written on this ticket, it cannot be transferred to anyone else.'},
    {zh:'没有人接听前台的电话，我只好留了一条留言。',en:'No one answered the phone at reception, so I had to leave a message.'},
    {zh:'清单上的价格已经包含安装费，无须另外付款。',en:'The prices on the list already include installation, so no extra payment is required.'},
    {zh:'我一直在等的那批货昨天终于送到了，可是少了两个箱子。',en:'The shipment I had been waiting for finally arrived yesterday, but two boxes were missing.'},
    {zh:'负责保管钥匙的人今天请假了，我们进不了储藏室。',en:'The person responsible for the keys is on leave today, leaving us unable to enter the storeroom.'},
  ],
  [
    {zh:'停车场满了的情况下，司机可以把车停在体育馆后面。',en:'When the car park is full, drivers can park behind the sports centre.'},
    {zh:'他把闹钟设在六点，却忘了打开声音。',en:'He set his alarm for six but forgot to turn the sound on.'},
    {zh:'她交来的两份草稿都没有署名。',en:'Neither of the two drafts she handed in had her name on it.'},
    {zh:'管理员要求所有人把椅子放回原处，再离开大厅。',en:'The caretaker asked everyone to put the chairs back where they belonged before leaving the hall.'},
    {zh:'原来放在入口处的捐款箱已经移到服务台旁边了。',en:'The donation box that used to be at the entrance has been moved next to the information desk.'},
  ],
];

export function selectAssessmentForm(results) {
  const seen = new Set(results.flatMap(result => (result.answers || []).map(answer => answer.zh)));
  return assessmentForms.find(form => form.every(item => !seen.has(item.zh))) ||
    assessmentForms[results.length % assessmentForms.length];
}
