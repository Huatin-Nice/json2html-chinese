"use strict";

window.renderStatistics = function(text) {
  function gather(root) {
    let elementCount = 0;
    let arrayCount = 0;
    let objectCount = 0;

    function visit(node) {
      elementCount++;
      if(node.simple) return;

      if(node.type == "array") arrayCount++;
      else if(node.type == "object") objectCount++;

      node.tuples.forEach(function(tuple) {
        visit(tuple.value);
      });
    }

    visit(root);

    return {
      elementCount: elementCount,
      arrayCount: arrayCount,
      objectCount: objectCount
    };
  };

  function render(text) {
    const textByteLength = Util.byteLength(text);
    const result = gather(window.tree.root);
    return `
      <div id='stats'>
        <h3>数据统计</h3>
        <table>
          <tr>
            <td>数组数量:</td>
            <td>${Util.format(result.arrayCount)}</td>
          </tr>
          <tr>
            <td>对象数量:</td>
            <td>${Util.format(result.objectCount)}</td>
          </tr>
          <tr>
            <td>所有元素的总数:</td>
            <td>${Util.format(result.elementCount)}</td>
          </tr>
          <tr>
            <td>JSON最大嵌套深度:</td>
            <td>${Util.format(window.tree.nestingLevel)}</td>
          </tr>
          <tr>
            <td>JSON文档的大小 (UTF-8 字节):</td>
            <td>${Util.humanFileSize(textByteLength)} (${Util.format(textByteLength)} B)</td>
          </tr>
          <tr>
            <td>JSON文档的大小 (UTF-16 代码计数):</td>
            <td>${Util.humanFileSize(text.length)} (${Util.format(text.length)} B)</td>
          </tr>
        </table>
      </div>
    `;
  }

  return render(text);
};
