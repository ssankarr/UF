function calculateMonthlyPayment(principal, annualRate, years) {
	const monthlyRate = annualRate / 100 / 12;
	const months = years * 12;

	if (monthlyRate === 0) {
		return principal / months;
	}

	return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

function formatCurrency(amount) {
	return new Intl.NumberFormat("en-AU", {
		style: "currency",
		currency: "AUD",
		maximumFractionDigits: 2
	}).format(amount);
}

function roundCurrency(amount) {
	return Math.round(amount * 100) / 100;
}

function calculateRepaymentResults(principal, annualRate, years) {
	const monthly = calculateMonthlyPayment(principal, annualRate, years);
	const totalPayment = monthly * 12 * years;

	return {
		monthly,
		fortnightly: 12 * monthly / 26,
		weekly: 12 * monthly / 52,
		totalInterest: totalPayment - principal,
		totalPayment
	};
}

function setupCalculator(form) {
	if (!form) {
		return;
	}

	const amountInput = form.querySelector("[data-calc='amount']");
	const rateInput = form.querySelector("[data-calc='rate']");
	const termInput = form.querySelector("[data-calc='term']");
	const frequencySelect = form.querySelector("[data-calc='frequency']");
	const repaymentOutput = form.querySelector("[data-calc-output='repayment']");
	const interestOutput = form.querySelector("[data-calc-output='interest']");
	const paymentOutput = form.querySelector("[data-calc-output='payment']");

	function updateResults() {
		const principal = Number(amountInput.value);
		const rate = Number(rateInput.value);
		const years = Number(termInput.value);

		if (!principal || !rate || !years) {
			repaymentOutput.textContent = "Please enter valid values to calculate repayment.";
			if (interestOutput) {
				interestOutput.textContent = "";
			}
			if (paymentOutput) {
				paymentOutput.textContent = "";
			}
			return;
		}

		const results = calculateRepaymentResults(principal, rate, years);
		const frequency = frequencySelect ? frequencySelect.value : "monthly";
		const labels = {
			monthly: "Monthly payment",
			fortnightly: "Fortnightly payment",
			weekly: "Weekly payment"
		};

		repaymentOutput.textContent = labels[frequency] + ": " + formatCurrency(roundCurrency(results[frequency]));
		if (interestOutput) {
			interestOutput.textContent = "Total interest: " + formatCurrency(roundCurrency(results.totalInterest));
		}
		if (paymentOutput) {
			paymentOutput.textContent = "Total payment: " + formatCurrency(roundCurrency(results.totalPayment));
		}
	}

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		updateResults();
	});

	if (frequencySelect) {
		frequencySelect.addEventListener("change", updateResults);
	}

	updateResults();
}

function initializeSnapshotForm() {
	const form = document.getElementById("snapshotForm");
	const result = document.getElementById("snapshotResult");
	const emailLink = document.getElementById("snapshotEmailLink");
	const whatsAppLink = document.getElementById("snapshotWhatsAppLink");

	if (!form || !result) {
		return;
	}

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		const loanType = document.getElementById("loanType").value;
		const suburb = document.getElementById("suburb").value.trim();
		const income = Number(document.getElementById("income").value);
		const deposit = Number(document.getElementById("deposit").value);
		const targetAmount = Number(document.getElementById("targetAmount").value);

		if (!income || !targetAmount || income < 2000 || !suburb) {
			result.textContent = "Please enter realistic values and your suburb to generate your loan health check.";
			return;
		}

		const indicativeCapacity = Math.max(0, income * 12 * 5.2 + deposit);
		const estimatedMonthlyRepayment = calculateMonthlyPayment(targetAmount, 5.5, 25);
		const match = targetAmount <= indicativeCapacity ? "Strong match" : "Needs structure review";
		const loanTypeLabels = {
			home: "Home Loan",
			refinance: "Refinance",
			"first-home": "First Home Buyer",
			car: "Car Loan",
			commercial: "Commercial Loan"
		};
		const summary = loanTypeLabels[loanType] + " health check for " + suburb + ": " + match + ". Indicative max range " + formatCurrency(indicativeCapacity) + ". Estimated monthly repayment around " + formatCurrency(roundCurrency(estimatedMonthlyRepayment)) + ".";

		result.textContent = summary;

		if (emailLink) {
			emailLink.href = "mailto:info@uloansfinance.com.au?subject=" + encodeURIComponent("Loan health check from " + suburb) + "&body=" + encodeURIComponent(summary + "\n\nPlease contact me about next steps and fact find.");
		}

		if (whatsAppLink) {
			whatsAppLink.href = "https://wa.me/61451542722?text=" + encodeURIComponent("Hi Uloans, here is my loan health check. " + summary + " Please contact me about next steps.");
		}
	});
}

function initializeCallbackForm() {
	const form = document.getElementById("callbackForm");
	const result = document.getElementById("callbackResult");

	if (!form || !result) {
		return;
	}

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		const name = document.getElementById("name").value.trim();
		const suburb = document.getElementById("lead-suburb").value.trim();
		const goal = document.getElementById("goal").value;
		const timeframe = document.getElementById("timeframe").value;

		if (!name || !suburb) {
			result.textContent = "Please complete your details so Uloans can respond quickly.";
			return;
		}

		result.textContent = "Thanks " + name + ". Your " + goal.toLowerCase() + " enquiry for " + suburb + " is ready for follow-up. Priority: " + timeframe + ". Best next step is a callback or secure fact find.";
	});
}

function initializeRevealAnimations() {
	const observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.05 });

	document.querySelectorAll(".section, .hero-card, .card, .feature-grid article, .steps article").forEach(function (element) {
		element.classList.add("reveal");
		observer.observe(element);
	});
}

function initializeCampaignModal() {
	const isHomePage = window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");
	if (!isHomePage) {
		return;
	}

	const assessmentUrl = "https://app.middle.finance/ref/9f5745d5-ed53-4b26-9bb2-8b21437cd93b";
	const bookingUrl = "https://bookings.cloud.microsoft/book/AppointmentwithDhirajUloansFinance@uloansfinance.com.au/?ismsaljsauthenabled";

	const modal = document.createElement("div");
	modal.className = "campaign-modal";
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-modal", "true");
	modal.setAttribute("aria-labelledby", "campaign-modal-title");
	modal.innerHTML = ""
		+ "<div class=\"campaign-modal__dialog\">"
		+ "  <div class=\"campaign-modal__header\">"
		+ "    <h2 class=\"campaign-modal__title\" id=\"campaign-modal-title\">Complimentary Home Loan Assessment</h2>"
		+ "    <button class=\"campaign-modal__close\" type=\"button\" aria-label=\"Close campaign modal\">&times;</button>"
		+ "  </div>"
		+ "  <p class=\"campaign-modal__lead\">Complete your assessment for a chance to win.</p>"
		+ "  <p class=\"campaign-modal__highlight\"><strong>Win a $500 Gift Card!</strong></p>"
		+ "  <p class=\"campaign-modal__lead\">Complete your assessment for a chance to win</p>"
		+ "  <ul class=\"campaign-modal__list\">"
		+ "    <li>No obligation</li>"
		+ "    <li>Range of lending options</li>"
		+ "    <li>Personalised loan comparison</li>"
		+ "    <li>Expert advice</li>"
		+ "  </ul>"
		+ "  <div class=\"campaign-modal__actions\">"
		+ "    <a class=\"btn\" href=\"" + assessmentUrl + "\">Get free assessment</a>"
		+ "    <a class=\"btn btn-ghost\" href=\"" + bookingUrl + "\">Book appointment</a>"
		+ "  </div>"
		+ "</div>";

	document.body.appendChild(modal);

	function closeModal() {
		modal.classList.remove("is-open");
	}

	modal.querySelector(".campaign-modal__close").addEventListener("click", closeModal);
	modal.addEventListener("click", function (event) {
		if (event.target === modal) {
			closeModal();
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && modal.classList.contains("is-open")) {
			closeModal();
		}
	});

	window.setTimeout(function () {
		modal.classList.add("is-open");
	}, 12000);
}

document.querySelectorAll("[data-loan-calculator]").forEach(setupCalculator);
initializeSnapshotForm();
initializeCallbackForm();
initializeRevealAnimations();
initializeCampaignModal();