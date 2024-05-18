const div_confirm_area = document.getElementById("confirm_area");
const span_save_data_warning = document.getElementById("save_data_warning");
const input_save_data_delete = document.getElementById("save_data_delete");
const input_confirm_btn = document.getElementById("confirm_btn");
const div_DNAgenerator_area = document.getElementById("DNAgenerator_area");
const span_DNAgenerator_level = document.getElementById("DNAgenerator_level");
/**@type {HTMLInputElement} */
const input_DNA_levelup = document.getElementById("DNA_levelup");
const div_DNA_table = document.getElementById("DNA_table");
const div_table_area = document.getElementById("table_area");
const input_register_form_show_btn = document.getElementById("register_form_show_btn");
const select_filter_creatureDNA = document.getElementById("filter_creatureDNA");
const select_filter_artificialDNA = document.getElementById("filter_artificialDNA");
const select_filter_result = document.getElementById("filter_result");
const tbody_table_body = document.getElementById("table_body");
const div_register_form_wrapper = document.getElementById("register_form_wrapper");
const div_register_title = document.getElementById("register_title");
/**@type {HTMLSelectElement} */
const select_register_creatureDNA = document.getElementById("register_creatureDNA");
/**@type {HTMLSelectElement} */
const select_register_artificialDNA = document.getElementById("register_artificialDNA");
/**@type {HTMLInputElement} */
const input_register_result = document.getElementById("register_result");
/**@type {HTMLInputElement} */
const input_failed = document.getElementById("failed");
const input_register_btn = document.getElementById("register_btn");
const input_register_cancel_btn = document.getElementById("register_cancel_btn");


let confirmed = false; 

let DNA_generator_level = 0;




let modify_number;
/**@type {[{number: number, creDNA: string, artDNA: string, result: string, tr_elem: HTMLTableRowElement}]} */
let table_data = [
  /*
  {
    number: 1,
    creDNA: "原子生命体",
    artDNA: "原子生命体",
    result: "アメーバ",
    tr_elem: tr_first_tr
  }*/
];

/**
 * 
 * @param {{creDNA: string, artDNA: string, result: string}} record 
 */
function add_record (record) {
  let new_number = 1;
  table_data.forEach(function (elem) {
    if (elem.number >= new_number) new_number = elem.number + 1;
  });
  record.number = new_number;
  let my_tr = document.createElement("tr");
    let my_td = document.createElement("td");
    my_td.innerText = String(new_number);
  my_tr.appendChild(my_td);
    my_td = document.createElement("td");
    my_td.innerText = record.creDNA;
  my_tr.appendChild(my_td);
    my_td = document.createElement("td");
    my_td.innerText = record.artDNA;
  my_tr.appendChild(my_td);
    my_td = document.createElement("td");
    if (record.result === "fail") {
      my_td.innerText = "×";
    }else{
      my_td.innerText = record.result;
    }
  my_tr.appendChild(my_td);
    my_td = document.createElement("td");
      let my_input = document.createElement("input");
      my_input.type = "button";
      my_input.my_num = new_number;
      my_input.value = "修正";
      my_input.classList.add("modify");
      my_input.addEventListener("click", modify_event_listener);
    my_td.appendChild(my_input);
  my_tr.appendChild(my_td);
  tbody_table_body.appendChild(my_tr);
  record.tr_elem = my_tr;
  table_data.push(record);
  filter_update();
  filter_listener();
}

/**
 * 
 * @param {MouseEvent} event 
 */
function modify_event_listener (event) {
  register_form_show(event.target.my_num);
}
/**
 * 各トラックのデータを更新する。トラックのソートはしない。
 */
function update_tr () {
  table_data.forEach(function (elem) {
    elem.tr_elem.children[1].innerText = elem.creDNA;
    elem.tr_elem.children[2].innerText = elem.artDNA;
    if (elem.result === "fail") {
      elem.tr_elem.children[3].innerText = "×";
    }else{
      elem.tr_elem.children[3].innerText = elem.result;
    }
  });
  filter_update();
}

function sort_tr () {

}

function register_form_show (modify_num = 0) {
  modify_number = modify_num;
  if (modify_num === 0) {
    div_register_title.innerText = "結果を登録";
    input_register_btn.value = "登録";
    select_register_creatureDNA.value = "";
    select_register_artificialDNA.value = "";
    input_register_result.value = "";
    input_failed.checked = false;
  }else{
    let target_record = table_data.filter(elem => (elem.number === modify_num))[0];
    div_register_title.innerText = "結果を修正";
    input_register_btn.value = "修正";
    select_register_creatureDNA.value = target_record.creDNA;
    select_register_artificialDNA.value = target_record.artDNA;
    let failed = (target_record.result === "fail");
    input_failed.checked = failed;
    if (failed) {
      input_register_result.value = "";
    }else{
      input_register_result.value = target_record.result;
    }
  }
  input_failed_listener();
  div_register_form_wrapper.classList.remove("hidden");
  document.body.parentElement.addEventListener("touchmove", noscroll, {passive: false});
  document.body.parentElement.addEventListener("wheel", noscroll, {passive: false});
  
}
function register_form_hide () {
  div_register_form_wrapper.classList.add("hidden");
  document.body.parentElement.removeEventListener("touchmove", noscroll, {passive: false});
  document.body.parentElement.removeEventListener("wheel", noscroll, {passive: false});
  
}

/**
 * 
 * @param {Event} event 
 */
function noscroll (event) {
  event.preventDefault();
}

let artDNA_set = new Set();
artDNA_set.add("");
artDNA_set.add("原始生命体");

function filter_update () {
  let creDNA_set = new Set();
  let result_set = new Set();
  creDNA_set.add("");
  creDNA_set.add("原始生命体");
  result_set.add("");

  table_data.forEach(function (elem) {
    if (elem.result !== "fail") {
      creDNA_set.add(elem.result);
    }
    result_set.add(elem.result);
  });
  Array.from(select_filter_artificialDNA.children).forEach(function (elem) {
    /**@type {HTMLOptionElement} */
    let target_option = elem;
    if (artDNA_set.has(target_option.value)) {
      select_filter_artificialDNA.removeChild(target_option);
    }
  });
  Array.from(select_filter_creatureDNA.children).forEach(function (elem) {
    /**@type {HTMLOptionElement} */
    let target_option = elem;
    if (creDNA_set.has(target_option.value)) {
      select_filter_creatureDNA.removeChild(target_option);
    }
  });
  Array.from(select_filter_result.children).forEach(function (elem) {
    /**@type {HTMLOptionElement} */
    let target_option = elem;
    if (result_set.has(target_option.value)) {
      select_filter_result.removeChild(target_option);
    }
  });
  Array.from(select_register_artificialDNA.children).forEach(function (elem) {
    /**@type {HTMLOptionElement} */
    let target_option = elem;
    if (artDNA_set.has(target_option.value)) {
      select_register_artificialDNA.removeChild(target_option);
    }
  });
  Array.from(select_register_creatureDNA.children).forEach(function (elem) {
    /**@type {HTMLOptionElement} */
    let target_option = elem;
    if (creDNA_set.has(target_option.value)) {
      select_register_creatureDNA.removeChild(target_option);
    }
  });
  
  let arr_filter_artDNA_chilren = Array.from(select_filter_artificialDNA.children);
  let arr_register_artDNA_children = Array.from(select_register_artificialDNA.children);
  Array.from(artDNA_set).forEach(function (elem) {
    let target_option = arr_filter_artDNA_chilren.find(elem2 => (elem2.value === elem));
    if (target_option === undefined) {
      let my_option = document.createElement("option");
      my_option.value = elem;
      my_option.innerText = elem;
      select_filter_artificialDNA.appendChild(my_option);
    }
    target_option = arr_register_artDNA_children.find(elem2 => (elem2.value === elem));
    if (target_option === undefined) {
      let my_option = document.createElement("option");
      my_option.value = elem;
      my_option.innerText = elem;
      select_register_artificialDNA.appendChild(my_option);
    }
  });

  let arr_filter_creDNA_chilren = Array.from(select_filter_creatureDNA.children);
  let arr_register_creDNA_children = Array.from(select_register_creatureDNA.children);
  Array.from(creDNA_set).sort().forEach(function (elem) {
    let target_option = arr_filter_creDNA_chilren.find(elem2 => (elem2.value === elem));
    if (target_option === undefined) {
      let my_option = document.createElement("option");
      my_option.value = elem;
      my_option.innerText = elem;
      select_filter_creatureDNA.appendChild(my_option);
    }else{
      select_filter_creatureDNA.appendChild(target_option);
    }
    target_option = arr_register_creDNA_children.find(elem2 => (elem2.value === elem));
    if (target_option === undefined) {
      let my_option = document.createElement("option");
      my_option.value = elem;
      my_option.innerText = elem;
      select_register_creatureDNA.appendChild(my_option);
    }else{
      select_register_creatureDNA.appendChild(target_option);
    }
  });

  let arr_filter_result_chilren = Array.from(select_filter_result.children);
  Array.from(result_set).sort().forEach(function (elem) {
    let target_option = arr_filter_result_chilren.find(elem2 => (elem2.value === elem));
    if (target_option === undefined) {
      let my_option = document.createElement("option");
      my_option.value = elem;
      if (elem === "fail") {
        my_option.innerText = "×";
      }else{
        my_option.innerText = elem;
      }
      select_filter_result.appendChild(my_option);
    }else{
      select_filter_result.appendChild(target_option);
    }
  });
  
}

/**
 * 
 * @param {{creDNA: string, artDNA: string, result: string}} data 
 */
function filter_apply (data) {
  if (data.creDNA === "" && data.artDNA === "" && data.result === "") {
    table_data.forEach(elem => {
      elem.tr_elem.classList.remove("hidden");
    });
  }else{
    table_data.forEach(elem => {
      let flag = false;
      if (data.creDNA === elem.creDNA && data.creDNA !== "") flag = true;
      if (data.artDNA === elem.artDNA && data.artDNA !== "") flag = true;
      if (data.result === elem.result && data.result !== "") flag = true;
      if (flag) {
        elem.tr_elem.classList.remove("hidden");
      }else{
        elem.tr_elem.classList.add("hidden");
      }
    });
  }
  if (data.creDNA === "") {
    select_filter_creatureDNA.previousElementSibling.classList.remove("filter_on");
  }else{
    select_filter_creatureDNA.previousElementSibling.classList.add("filter_on");
  }
  if (data.artDNA === "") {
    select_filter_artificialDNA.previousElementSibling.classList.remove("filter_on");
  }else{
    select_filter_artificialDNA.previousElementSibling.classList.add("filter_on");
  }
  if (data.result === "") {
    select_filter_result.previousElementSibling.classList.remove("filter_on");
  }else{
    select_filter_result.previousElementSibling.classList.add("filter_on");
  }
  
}

function filter_listener (event) {
  let my_data = {}
  my_data.creDNA = select_filter_creatureDNA.value;
  my_data.artDNA = select_filter_artificialDNA.value;
  my_data.result = select_filter_result.value;
  filter_apply(my_data);
}

/**
 * @returns {string}
 */
function data_export () {
  let my_data = {};
  my_data.DNAlevel = DNA_generator_level;
  my_data.table = table_data;
  return JSON.stringify(my_data);
}

/**
 * 
 * @param {string} data 
 */
function data_import (data) {
  let my_data = JSON.parse(data);
  table_data = [];
  Array.from(tbody_table_body.children).forEach(elem => {
    tbody_table_body.removeChild(elem);
  });
  
  if (my_data.DNAlevel > 5) my_data.DNAlevel = 5;
  while (my_data.DNAlevel > DNA_generator_level) {
    input_DNA_levelup.click();
  }
  /**@type {[{number: number, creDNA: string, artDNA: string, result: string}]} */
  let my_table = my_data.table.sort((a, b) => (a.number - b.number));
  my_table.forEach(elem => {
    add_record({creDNA: elem.creDNA, artDNA: elem.artDNA, result: elem.result});
  });
}


function init_event_listener () {
  
  input_register_form_show_btn.addEventListener("click", function (event) {
    register_form_show(0);
  });
  input_register_cancel_btn.addEventListener("click", register_form_hide);
  input_register_btn.addEventListener("click", function (event) {
    let failed = input_failed.checked;
    let creDNA = select_register_creatureDNA.value;
    let artDNA = select_register_artificialDNA.value;
    let result = input_register_result.value;
    if (creDNA === "") return;
    if (artDNA === "") return;
    if (failed) {
      result = "fail";
    }else{
      if (result === "") return;
    }
    if (modify_number === 0) {
      add_record({creDNA: creDNA, artDNA: artDNA, result: result});
    }else{
      let target_record = table_data.filter(elem => (elem.number === modify_number))[0];
      target_record.creDNA = creDNA;
      target_record.artDNA = artDNA;
      target_record.result = result;
      update_tr();
    }
    register_form_hide();
    window.localStorage.setItem("play_data", data_export());
  });
  input_DNA_levelup.addEventListener("click", function (event) {
    if (DNA_generator_level >= 5) return;
    DNA_generator_level++;
    let addDNAs = [];
    switch (DNA_generator_level) {
      case 1:
        addDNAs.push("魚類");
        addDNAs.push("軟体類");
        break;
      case 2:
        addDNAs.push("昆虫類");
        addDNAs.push("甲虫類");
        addDNAs.push("深海");
        break;
      case 3:
        addDNAs.push("両生類");
        addDNAs.push("爬虫類");
        addDNAs.push("甲羅");
        addDNAs.push("巨大");
        break;
      case 4:
        addDNAs.push("哺乳類");
        addDNAs.push("鳥類");
        addDNAs.push("古代");
        addDNAs.push("肉食類");
        break;
      case 5:
        addDNAs.push("神秘");
        addDNAs.push("知性");
        break;
    }
    addDNAs.forEach(elem => {
      artDNA_set.add(elem);
      let my_div = document.createElement("div");
      my_div.classList.add("DNA_item");
      my_div.innerText = elem + "のDNA";
      div_DNA_table.appendChild(my_div);
    });
    span_DNAgenerator_level.innerText = "Lv" + DNA_generator_level;
    input_DNA_levelup.value = `レベルアップ(Lv${DNA_generator_level}→Lv${DNA_generator_level+1})`;
    if (DNA_generator_level === 5) {
      input_DNA_levelup.value = "レベルマックス";
      input_DNA_levelup.disabled = true;
    }
    filter_update();
  });
  input_failed.addEventListener("change", input_failed_listener);
  select_filter_artificialDNA.addEventListener("change", filter_listener);
  select_filter_creatureDNA.addEventListener("change", filter_listener);
  select_filter_result.addEventListener("change", filter_listener);
  input_register_result.addEventListener("keypress", function (event) {
    if (input_register_result.value !== "") {
      input_register_btn.focus();
    }
  });
  input_confirm_btn.addEventListener("click", function (event) {
    confirmed = true;
    div_confirm_area.classList.add("hidden");
    div_DNAgenerator_area.classList.remove("hidden");
    div_table_area.classList.remove("hidden");
    let my_data = window.localStorage.getItem("play_data");
    if (my_data === null) {
      add_record({creDNA: "原始生命体", artDNA: "原始生命体", result: "アメーバ"});
      update_tr();
    }else{
      data_import(my_data);
    }
  });
  input_save_data_delete.addEventListener("click", function (event) {
    if (!window.confirm("前回の記録データを削除します\n(※実際のゲームのデータとは関係ありません。)")) return;
    window.localStorage.removeItem("play_data");
    span_save_data_warning.classList.add("hidden");
    input_save_data_delete.classList.add("hidden");
    input_save_data_delete.disabled = true;
  });
}

function initialize () {
  if (window.localStorage.getItem("play_data") !== null) {
    span_save_data_warning.classList.remove("hidden");
    input_save_data_delete.classList.remove("hidden");
    input_save_data_delete.disabled = false;
  }
}

function input_failed_listener (event) {
  if (input_failed.checked) {
    input_register_result.disabled = true;
    input_register_result.value = "";
  }else{
    input_register_result.disabled = false;
  }
}

initialize();
init_event_listener();

