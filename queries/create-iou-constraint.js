module.exports = (param) => `
CREATE CONSTRAINT ON (iou:IOU) ASSERT iou.id IS UNIQUE
`
