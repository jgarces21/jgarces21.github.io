const minimumSalary = 470; // 2025

const calculate = function (salary) {
    salary = Number(salary);
    var CostConcept = function () {
        this.name = '';
        this.frequency = 'mensual';
        this.bold = false;
        this.value = 0;
    };
    var result = [];
    var s = new CostConcept();
    s.name = 'Salario acordado';
    s.value = salary;
    result.push(s);

    // iess
    var iess = new CostConcept();
    iess.name = 'IESS Empleado (9.45%)';
    iess.value = salary * 0.0945;
    result.push(iess);

    var fondosReserva = new CostConcept();
    fondosReserva.name = 'Fondos de Reserva (a partir del 13er mes) 1 sueldo/12';
    fondosReserva.value = salary / 12;
    result.push(fondosReserva);

    // iess empleador
    var iessE = new CostConcept();
    iessE.name = 'IESS Empleador (11.15%)';
    iessE.value = salary * 0.1115;
    result.push(iessE);

    var salarioRecibirEmpleado = new CostConcept();
    salarioRecibirEmpleado.name = 'Salario a recibir por Empleado (sin descontar impuesto a la renta)';
    salarioRecibirEmpleado.value = salary - iess.value;
    result.push(salarioRecibirEmpleado);

    var salarioPagarEmpleador = new CostConcept();
    salarioPagarEmpleador.name = 'Salario a pagar por Empleador';
    salarioPagarEmpleador.value = salary + iessE.value;
    result.push(salarioPagarEmpleador);

    // decimo tercero
    var d3ro = new CostConcept();
    d3ro.name = 'Décimo Tercero';
    d3ro.frequency = 'anual';
    d3ro.value = salary * 12 / 12;
    result.push(d3ro);

    // decimo cuarto
    var d4to = new CostConcept();
    d4to.name = 'Décimo Cuarto';
    d4to.frequency = 'anual';
    d4to.value = minimumSalary;
    result.push(d4to);

    // Anualizado empleado
    var anual = new CostConcept();
    anual.name = 'Total para el Empleado';
    anual.frequency = 'anual';
    anual.value = (salary * 12) +
        (iess.value * -12) +
        (d3ro.value) +
        (d4to.value);
    anual.bold = true;
    anual.secondaryColor = true;
    result.push(anual);

    // Anualizado empleador
    var anualE = new CostConcept();
    anualE.name = 'Total para el Empleador';
    anualE.frequency = 'anual';
    anualE.value = (salary * 12) +
        (iess.value * -12) +
        (iessE.value * 12) +
        (d3ro.value) +
        (d4to.value);
    anualE.bold = true;
    result.push(anualE);

    // Anualizado empleador con fondos de reserva
    var anualEFR = new CostConcept();
    anualEFR.name = 'Total para el Empleador (Incluye fondos de reserva)';
    anualEFR.frequency = 'anual';
    anualEFR.value = (salary * 12) +
        (iess.value * -12) +
        (iessE.value * 12) +
        (d3ro.value) +
        (d4to.value) +
        (fondosReserva.value * 12);
    anualEFR.bold = true;
    result.push(anualEFR);
    return result;
};

const rowResultRender = function (item) {
    const value = new Intl.NumberFormat('es-EC', {style: 'currency', currency: 'USD'}).format(item.value)
    return `<div class="result-item">
      <span class="col-8 ${item.bold ? 'fw-bold' : ''}">${item.name}</span>
      <span class="col-2 ${item.bold ? 'fw-bold' : ''} text-center">${item.frequency}</span>
      <span class="col-2 ${item.bold ? 'fw-bold' : ''} ${item.secondaryColor ? 'secondary' : ''} text-end">${value}</span>
    </div>`
}

const syncUI = function (result, val) {
    let warningElement = document.getElementById('warning');
    if (val < minimumSalary) {
        warningElement.classList.remove('d-none');
    } else {
        warningElement.classList.add('d-none');
    }
    document.getElementById('table-body').innerHTML = result.map(rowResultRender).join('')
}

window.onload = function () {
    document.getElementById('gross-salary').value = minimumSalary;

    let result = calculate(minimumSalary);
    syncUI(result, minimumSalary);

    document.getElementById('gross-salary').addEventListener('change', function () {
        let val = this.value
        let result = calculate(val);
        syncUI(result, val);
    });
    document.getElementById('warning-message').innerHTML = 'El salario ingresado es menor al mínimo legal de ' + minimumSalary;
};