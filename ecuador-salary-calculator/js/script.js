const minimumSalary = 470; // 2025
const localNumberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

const waitThenRun = function (objectToWaitFor, callback) {
    const interval = setInterval(function () {
        if (window[objectToWaitFor] !== undefined) {
            clearInterval(interval);
            callback();
        }
    }, 100);
};

const round = function (number, places) {
    return +(Math.round(number + "e+" + places) + "e-" + places);
}

const calculate = function (salary) {
    salary = Number(salary);
    var CostConcept = function () {
        this.name = '';
        this.frequency = 'mensual';
        this.bold = false;
        this.value = 0;
    };
    var result = new Map();
    var s = new CostConcept();
    s.name = 'Salario acordado';
    s.value = round(salary, 2);
    result.set('s', s);

    // iess
    var iess = new CostConcept();
    iess.name = 'IESS Empleado (9.45%)';
    iess.value = round(salary * 0.0945, 2);
    result.set('iess', iess);

    var fondosReserva = new CostConcept();
    fondosReserva.name = 'Fondos de Reserva (1/12 sueldo)';
    fondosReserva.decorator = 'fa-calendar-plus';
    fondosReserva.value = round(salary / 12, 2);
    result.set('fondosReserva', fondosReserva);

    // iess empleador
    var iessE = new CostConcept();
    iessE.name = 'IESS Empleador (11.15%)';
    iessE.value = round(salary * 0.1115, 2);
    result.set('iessE', iessE);

    var salarioRecibirEmpleado = new CostConcept();
    salarioRecibirEmpleado.name = 'Salario a recibir por Empleado';
    salarioRecibirEmpleado.decorator = 'fa-receipt';
    salarioRecibirEmpleado.value = round(salary - iess.value, 2);
    result.set('salarioRecibirEmpleado', salarioRecibirEmpleado);

    var salarioPagarEmpleador = new CostConcept();
    salarioPagarEmpleador.name = 'Salario a pagar por Empleador';
    salarioPagarEmpleador.value = round(salary + iessE.value, 2);
    result.set('salarioPagarEmpleador', salarioPagarEmpleador);

    // decimo tercero
    var d3ro = new CostConcept();
    d3ro.name = 'D\u00E9cimo Tercero';
    d3ro.frequency = 'anual';
    d3ro.value = round(salary * 12 / 12, 2);
    result.set('d3ro', d3ro);

    // decimo cuarto
    var d4to = new CostConcept();
    d4to.name = 'D\u00E9cimo Cuarto';
    d4to.frequency = 'anual';
    d4to.value = round(minimumSalary, 2);
    result.set('d4to', d4to);

    // Anualizado empleado
    var anual = new CostConcept();
    anual.name = 'Total para el Empleado';
    anual.frequency = 'anual';
    anual.value = round((salary * 12) +
        (iess.value * -12) +
        (d3ro.value) +
        (d4to.value), 2);
    anual.bold = true;
    anual.secondaryColor = true;
    result.set('anual', anual);

    // Anualizado empleador
    var anualE = new CostConcept();
    anualE.name = 'Total para el Empleador';
    anualE.frequency = 'anual';
    anualE.value = round((salary * 12) +
        (iess.value * -12) +
        (iessE.value * 12) +
        (d3ro.value) +
        (d4to.value), 2);
    anualE.bold = true;
    result.set('anualE', anualE);

    // Anualizado empleador con fondos de reserva
    var anualEFR = new CostConcept();
    anualEFR.name = 'Total para el Empleador (Incluye fondos de reserva)';
    anualEFR.frequency = 'anual';
    anualEFR.value = round((salary * 12) +
        (iess.value * -12) +
        (iessE.value * 12) +
        (d3ro.value) +
        (d4to.value) +
        (fondosReserva.value * 12), 2);
    anualEFR.bold = true;
    result.set('anualEFR', anualEFR);
    return result;
};

const rowResultRender = function (item) {
    const value = localNumberFormat.format(item.value)
    let decorator = '';
    if (item.decorator) {
        decorator = `<span class="col-1 text-center"><i class="fas ${item.decorator} align-middle"></i></span>`
    }
    return `<div class="result-item">
      <span class="col-${item.decorator ? '7' : '8'} ${item.bold ? 'fw-bold' : ''}">${item.name}</span>
      ${decorator}
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
    document.getElementById('table-body').innerHTML = [...result.values()].map(rowResultRender).join('')
    $('#liquid-salary').val(result.get('salarioRecibirEmpleado').value.toFixed(2));
    $('#liquid-salary-2').val((result.get('salarioRecibirEmpleado').value + result.get('fondosReserva').value).toFixed(2));
}

function updateYear() {
    const yearElement = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearElement.textContent = '' + currentYear;
}

window.onload = function () {
    const fixedMinimumSalary = round(minimumSalary, 2).toFixed(2);
    document.getElementById('gross-salary').value = fixedMinimumSalary;

    let result = calculate(minimumSalary);
    syncUI(result, minimumSalary);

    document.getElementById('gross-salary').addEventListener('change', function () {
        let val = this.value
        let result = calculate(val);
        syncUI(result, val);
    });
    document.getElementById('warning-message').innerHTML = 'El salario ingresado es menor al m\u00EDnimo legal de ' + fixedMinimumSalary;
    updateYear();
};

waitThenRun("$", function () {
    $(document).ready(function () {
        $('#gross-salary').blur(function () {
            var inputValue = $(this).val();
            if (inputValue !== '') { // Check if the input is not empty
                var parsedValue = parseFloat(inputValue);
                if (!isNaN(parsedValue)) { // Check if the parsed value is a valid number
                    $(this).val(parsedValue.toFixed(2));
                } else {
                    // Handle invalid input, e.g., clear the field or show an error
                    $(this).val('');
                }
            }
        });
    });
});