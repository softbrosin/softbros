/**
 * Cluvana SaaS Platform & Softbros Interactive Scripts
 * Strictly implementing the SaaS Design System & Handoff Specifications
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroGeometricCanvas();
    initIntersectionObservers();
    initDashboardSimulator();
    initPersonaTabs();
    initFeatureModalSystem();
    initMobileNav();
    initDemoForm();
});

/* ==========================================================================
   1. Animated Abstract Green Geometric Lines Canvas (Hero Background)
   ========================================================================== */
function initHeroGeometricCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        createParticles();
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((width * height) / 18000); // Responsive density
        const nodeCount = Math.max(35, Math.min(count, 85));

        for (let i = 0; i < nodeCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 2 + 1.5,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    const lineAlpha = (1 - dist / 160) * 0.22;
                    ctx.beginPath();
                    ctx.strokeStyle = `#e9e1f2ff`; // Stroke #e9e1f2ff
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `#c199f4ff`; // #c199f4ff
            ctx.fill();

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce on edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

/* ==========================================================================
   2. Social Proof & Scroll Intersection Observer
   ========================================================================== */
function initIntersectionObservers() {
    const clientLogos = document.querySelectorAll('.client-logo-item');
    if (clientLogos.length > 0) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                    }, index * 90);
                }
            });
        }, { threshold: 0.15 });

        clientLogos.forEach(logo => logoObserver.observe(logo));
    }
}

/* ==========================================================================
   3. Interactive Dashboard Simulator (Core App UI)
   ========================================================================== */
const mockTableOrders = [
    { id: 'ORD-1048', table: 'Table #14 (Poolside)', station: 'Dining & Bar', items: '2x Club Sandwich, 1x Fresh Lime, 2x Single Malt 60ml', server: 'Ramesh K.', amount: '₹1,940', status: 'Ready to Serve', badgeClass: 'success' },
    { id: 'ORD-1049', table: 'Table #06 (Main Lounge)', station: 'Kitchen KDS', items: '1x Butter Chicken, 3x Garlic Naan, 1x Dal Makhani', server: 'Praveen S.', amount: '₹1,280', status: 'In Prep (4m)', badgeClass: 'pending' },
    { id: 'ORD-1050', table: 'Court #2 (Tennis Arena)', station: 'Sports Booking', items: 'Slot 7:00 PM - 8:00 PM (Floodlights Active)', server: 'Self / App', amount: '₹450', status: 'Confirmed', badgeClass: 'neutral' },
    { id: 'ORD-1051', table: 'Suite 204 (Cottage)', station: 'Rooms & Lodging', items: 'Guest Check-in: Col. Sharma + 1 Companion', server: 'Front Desk', amount: '₹3,500/night', status: 'Occupied', badgeClass: 'neutral' },
    { id: 'ORD-1052', table: 'Table #22 (Verandah)', station: 'Dining & Bar', items: '1x Grilled Fish, 1x Caesar Salad, 2x Heineken', server: 'Sunil M.', amount: '₹2,150', status: 'In Prep (7m)', badgeClass: 'pending' },
    { id: 'ORD-1053', table: 'Table #09 (Sports Bar)', station: 'Dining & Bar', items: '3x Draught Beer Pitcher, 2x Paneer Tikka', server: 'Ramesh K.', amount: '₹2,890', status: 'Paid (UPI)', badgeClass: 'success' },
    { id: 'ORD-1054', table: 'Banquet Hall #1', station: 'Rooms & Lodging', items: 'Diwali Committee Dinner Pre-Booking Deposit', server: 'Office Desk', amount: '₹25,000', status: 'Settled', badgeClass: 'success' }
];

function initDashboardSimulator() {
    const tableBody = document.getElementById('dashboard-table-body');
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (!tableBody) return;

    function renderTable(filter) {
        tableBody.innerHTML = '';
        const filtered = mockTableOrders.filter(row => {
            if (filter === 'all') return true;
            if (filter === 'dining' && row.station.includes('Dining')) return true;
            if (filter === 'kds' && row.station.includes('Kitchen')) return true;
            if (filter === 'rooms' && row.station.includes('Rooms')) return true;
            if (filter === 'sports' && row.station.includes('Sports')) return true;
            return false;
        });

        filtered.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-family: monospace; font-weight: 600; color: #FFFFFF;">${row.id}</td>
                <td><strong>${row.table}</strong></td>
                <td><span class="caption" style="color: #00C853;">${row.station}</span></td>
                <td style="max-width: 280px; overflow: hidden; text-overflow: ellipsis;">${row.items}</td>
                <td>${row.server}</td>
                <td style="font-weight: 600;">${row.amount}</td>
                <td>
                    <span class="status-badge ${row.badgeClass}">
                        ${row.status}
                    </span>
                </td>
                <td>
                    <button class="table-action-button" onclick="handleSimulatedAction('${row.id}')" title="Simulate real-time status update">
                        ${row.status === 'Ready to Serve' ? 'Print KOT' : (row.status.includes('Prep') ? 'Mark Ready' : 'View Ledger')}
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderTable(tab.dataset.filter);
        });
    });

    renderTable('all');

    // Make action globally available
    window.handleSimulatedAction = (id) => {
        const item = mockTableOrders.find(o => o.id === id);
        if (!item) return;

        if (item.status === 'Ready to Serve') {
            alert(`[Cluvana ESC/POS Driver]: Simulated driver-free KOT print sent to Kitchen Bluetooth printer for ${item.id} (${item.table})`);
        } else if (item.status.includes('Prep')) {
            item.status = 'Ready to Serve';
            item.badgeClass = 'success';
            const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
            renderTable(activeFilter);

            // Flash notification
            showSystemBanner(`Ticket ${id} marked Ready to Serve! Floor waitstaff notified via WebSocket.`);
        } else {
            alert(`[Cluvana Ledger]: Member Dues record verified for ${id}. Direct 1-click settlement available.`);
        }
    };
}

function showSystemBanner(msg) {
    const existing = document.getElementById('cluvana-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'cluvana-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #1F1F1F;
        border: 1px solid #00C853;
        color: #FFFFFF;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    toast.innerHTML = `<span style="width:8px;height:8px;background:#00C853;border-radius:50%;display:inline-block"></span> ${msg}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ==========================================================================
   4. User Personas Tab Switching
   ========================================================================== */
function initPersonaTabs() {
    const tabButtons = document.querySelectorAll('.persona-tab-button');
    const panes = document.querySelectorAll('.persona-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRole = btn.dataset.role;

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panes.forEach(pane => {
                if (pane.id === `persona-${targetRole}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

/* ==========================================================================
   5. Feature Modal System
   ========================================================================== */
const featureLibrary = {
    'gate-verification': {
        title: 'Front Desk & Gate Entry Verification',
        category: 'Front Desk & Reception',
        summary: 'Enables receptionists and security gate staff to look up arriving members instantly by phone number or membership ID, confirming membership validity and dues status before admitting guests.',
        benefits: 'Prevents unauthorized entry by suspended or expired accounts, eliminates manual paper entry registers, and speeds up lobby reception.',
        example: 'A member arrives at the club gate; the receptionist types the last 4 digits of their phone number, confirms their active status and guest eligibility on a tablet, and admits them in seconds.'
    },
    'multi-tenancy': {
        title: 'Front Desk & Gate Entry Verification',
        category: 'Front Desk & Reception',
        summary: 'Enables receptionists and security gate staff to look up arriving members instantly by phone number or membership ID, confirming membership validity and dues status before admitting guests.',
        benefits: 'Prevents unauthorized entry by suspended or expired accounts, eliminates manual paper entry registers, and speeds up lobby reception.',
        example: 'A member arrives at the club gate; the receptionist types the last 4 digits of their phone number, confirms their active status and guest eligibility on a tablet, and admits them in seconds.'
    },
    'member-hierarchy': {
        title: 'Member Profiles & Committee Hierarchy',
        category: 'Club Administration',
        summary: 'Centralized member directory storing membership numbers, card IDs, profile photos, contact details, and executive committee roles.',
        benefits: 'Instant identification of members, staff, and leadership hierarchy (President, Secretary, Manager, Staff).',
        example: 'Front desk staff can view a member’s status, active committee designation, and past payment history immediately upon entry.'
    },
    'dues-ledger': {
        title: 'Member Dues & Outstanding Bill Ledger',
        category: 'Billing & Accounting',
        summary: 'Automatically tracks all unpaid dining, bar, lodging, and pre-booking bills under a member\'s account, alongside annual renewal dues and cancellation penalties.',
        benefits: 'Replaces manual ledger notebooks; provides members with a transparent list of order IDs and amounts; enables cashiers to clear balances in one click.',
        example: 'A member dines at the restaurant and settles later. The bill is logged as an unpaid balance. When settling at the counter later, the cashier pulls up the exact pending orders and marks them cleared.'
    },
    'pos-billing': {
        title: 'Restaurant, Bar & Lounge Billing (POS)',
        category: 'Food & Beverage Operations',
        summary: 'Fast touch-screen billing screen designed for high-traffic dining rooms, bars, and sports lounges.',
        benefits: 'Automatically handles food and liquor taxes, discounts, item additions, and order cancellations without calculation errors.',
        example: 'A cashier adds items to Table #12, selects UPI or Card payment, and prints a finalized tax receipt in seconds.'
    },
    'waiter-app': {
        title: 'Mobile Waiter Ordering App',
        category: 'Floor Operations',
        summary: 'Mobile-friendly ordering portal allowing waitstaff to browse categories, take orders, and check table availability right from the floor.',
        benefits: 'Speeds up service, eliminates walking back and forth to punch orders, and reduces dining errors.',
        example: 'A waiter takes an order by the pool using a mobile phone; food orders immediately pop up on the kitchen screen, and beverage orders route to the bar.'
    },
    'live-kds': {
        title: 'Live Kitchen Display System (KDS)',
        category: 'Kitchen Management',
        summary: 'Real-time kitchen monitor powered by WebSockets that updates dynamically when new orders arrive, with filters for Veg, Non-Veg, or All stations.',
        benefits: 'Keeps the kitchen organized during peak rush hours; allows chefs to notify waiters when dishes are ready.',
        example: 'The kitchen screen chimes and displays a new ticket; once cooked, the chef taps "Ready", notifying the floor server to collect it.'
    },
    'esc-pos': {
        title: 'Direct ESC/POS Thermal Printing',
        category: 'Hardware Integration',
        summary: 'Driver-free printing directly from the web browser to 58mm and 80mm ESC/POS thermal receipt printers over USB (WebUSB) or Bluetooth.',
        benefits: 'No extra print server software required; instantly prints KOTs and bills with automatic cutter and cash drawer kick support.',
        example: 'Confirming an order immediately prints a paper KOT on the kitchen\'s Bluetooth receipt printer.'
    },
    'table-buzzer': {
        title: 'Table-Side "Call for Service" (Waiter Buzzer)',
        category: 'Member Experience',
        summary: 'Digital paging system allowing members to summon waitstaff with instant audio and visual alerts on the staff dashboard.',
        benefits: 'Members never have to wave their hands for service; staff respond faster to seated guests.',
        example: 'A diner clicks "Call for Service" on their table screen; a chime plays on the floor manager\'s and waiter\'s mobile dashboard showing Table #5 needs attention.'
    },
    'rooms-booking': {
        title: 'Guest Rooms & Cottage Booking',
        category: 'Lodging Management',
        summary: 'Accommodation management module tracking room occupancy, guest check-in/out dates, extra companion charges, and housekeeping status (Clean, Occupied, Reserved).',
        benefits: 'Prevents double-booking and ensures room tariffs are accurately billed.',
        example: 'Reception checks a guest into Suite 101, adds companion details, and links the room charges to the host member.'
    },
    'sports-amenities': {
        title: 'Sports & Recreation Amenities Booking',
        category: 'Sports Facilities',
        summary: 'Facility scheduling engine for tennis courts, badminton courts, swimming pools, snooker tables, and gym amenities.',
        benefits: 'Ensures fair court sharing among members and automates time-slot allocation.',
        example: 'A member reserves Badminton Court #2 for a 7:00 PM slot with confirmation sent to their account.'
    },
    'banquets-booking': {
        title: 'Advance Pre-Bookings & Party Hall Reservations',
        category: 'Event Reservations',
        summary: 'Reservation system for banquet halls, private dining rooms, and club lawns with advance deposit tracking and penalty calculation rules for late cancellations.',
        benefits: 'Protects club revenue against no-shows and generates formal booking receipts with clear terms.',
        example: 'A member books the banquet hall for a family dinner, pays an advance deposit, and receives an official booking receipt.'
    },
    'liquor-inventory': {
        title: 'Liquor Inventory & Bar Stock Ledger',
        category: 'Inventory & Beverage Audit',
        summary: 'Detailed bar inventory tracking bottles, volume in milliliters, peg measures, vendor purchases, and live stock movements.',
        benefits: 'Prevents inventory shrinkage, monitors stock levels in real time, and maintains accurate liquor registers.',
        example: 'Pouring a 60ml peg at the bar automatically deducts that exact volume from the active bottle stock in the system.'
    },
    'bar-wastage': {
        title: 'Bar Wastage & Breakage Logging',
        category: 'Loss Auditing',
        summary: 'Loss-tracking module to record transit breakage, bottle drops, or expired beverages with mandatory audit notes.',
        benefits: 'Keeps stock audits clean, accountable, and transparent.',
        example: 'A bartender logs a broken beer bottle with the reason, updating the wastage register for manager approval.'
    },
    'payroll-management': {
        title: 'Staff Payroll & Salary Management',
        category: 'HR & Statutory Compliance',
        summary: 'Automated monthly payroll suite supporting custom salary structures, attendance sheets, advance loans, and statutory deductions (PF, ESI, Professional Tax, TDS, LOP).',
        benefits: 'Eliminates manual spreadsheets and guarantees compliant salary calculations for club staff and ground workers.',
        example: 'The accounts office imports monthly staff attendance, and the system automatically computes net pay, deductions, and loan repayments.'
    },
    'bank-advice': {
        title: 'Bank Advice Letters & Batch Payslips',
        category: 'Finance Operations',
        summary: 'One-click generation of bank transfer schedules, formal bank disbursement advice letters, and downloadable PDF payslips for employees.',
        benefits: 'Saves hours of monthly payroll paperwork; staff can view and download their payslips directly.',
        example: 'The accountant exports the corporate bank transfer file and downloads all employee payslips in a single PDF batch.'
    },
    'financial-reports': {
        title: 'Financial & Daily Sales Reports',
        category: 'Executive Intelligence',
        summary: 'Reporting dashboard breaking down revenue across dining, bar, lodging, sports, subscriptions, and club operational expenses.',
        benefits: 'Gives committee executives and managers a clear view of daily cash flow, UPI collections, and pending balances.',
        example: 'The General Manager reviews the end-of-day summary comparing dining receipts against bar sales.'
    },
    'annual-subscriptions': {
        title: 'Annual Membership Subscriptions & Renewals',
        category: 'Membership Operations',
        summary: 'Tracks membership fee periods, identifies accounts due for renewal, and handles batch renewal billing.',
        benefits: 'Speeds up dues collection and ensures only active members enjoy club privileges.',
        example: 'The office triggers annual renewal invoices for all active members and records payments upon receipt.'
    },
    'affiliated-clubs': {
        title: 'Affiliated Clubs Directory',
        category: 'Member Privileges',
        summary: 'Directory of national and international partnered reciprocal clubs with contact details and map coordinates.',
        benefits: 'Allows members to explore reciprocal facilities when traveling to other cities.',
        example: 'A member traveling to Bengaluru checks the directory for affiliated golf clubs and views contact details for booking.'
    },
    'club-events': {
        title: 'Club Events & Meeting Minutes (MOM)',
        category: 'Communication & Governance',
        summary: 'Event announcement board with mobile push notifications and official committee Minutes of Meeting (MOM) archiving.',
        benefits: 'Keeps members informed of club activities and maintains organized records of committee resolutions.',
        example: 'The Secretary publishes minutes from the annual committee meeting and alerts members about the upcoming tournament.'
    },
    'role-security': {
        title: 'Role-Based Permissions & Two-Factor Login',
        category: 'Security & Access Control',
        summary: 'Secure login system with SMS OTP and Authenticator app two-factor verification, combined with strict role-based page permissions and admin IP allowlisting.',
        benefits: 'Protects confidential club financial records and ensures staff can only access pages relevant to their role.',
        example: 'Waiters can only view the ordering screen, while financial analytics and payroll require managerial credentials and 2FA.'
    }
};

function initFeatureModalSystem() {
    const modalBackdrop = document.getElementById('feature-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalSummary = document.getElementById('modal-summary');
    const modalBenefits = document.getElementById('modal-benefits');
    const modalExample = document.getElementById('modal-example');

    if (!modalBackdrop) return;

    function openModal(featureKey) {
        const data = featureLibrary[featureKey];
        if (!data) return;

        modalBadge.textContent = data.category;
        modalTitle.textContent = data.title;
        modalSummary.textContent = data.summary;
        modalBenefits.textContent = data.benefits;
        modalExample.textContent = data.example;

        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Attach to triggers
    document.querySelectorAll('[data-feature]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.dataset.feature;
            openModal(key);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
            closeModal();
        }
    });

    window.openFeatureDetail = openModal;
}

/* ==========================================================================
   6. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');

    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
        drawer.classList.toggle('active');
    });

    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('active');
        });
    });
}

/* ==========================================================================
   7. Demo Request Consultation Form (WhatsApp Integration)
   ========================================================================== */
function initDemoForm() {
    const form = document.getElementById('demo-request-form');
    if (!form) return;

    // Softbros Support WhatsApp Number (+91 8431027977)
    const WHATSAPP_PHONE = '918431027977';

    const formContainer = form.parentElement;
    const originalFormHtml = formContainer.innerHTML;

    function attachFormHandler(currentForm) {
        currentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = currentForm.querySelector('[name="name"]');
            const clubInput = currentForm.querySelector('[name="club"]');
            const emailInput = currentForm.querySelector('[name="email"]');
            const phoneInput = currentForm.querySelector('[name="phone"]');
            const productInput = currentForm.querySelector('[name="product"]');
            const membersInput = currentForm.querySelector('[name="members"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const club = clubInput ? clubInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            let hasError = false;

            [nameInput, clubInput, emailInput, phoneInput].forEach(field => {
                if (!field) return;
                if (!field.value.trim()) {
                    field.classList.add('error');
                    hasError = true;
                } else {
                    field.classList.remove('error');
                }
            });

            if (hasError) {
                alert('Please complete all required fields.');
                return;
            }

            // Determine Interest based on product dropdown or page context
            let interest = '';
            if (productInput) {
                interest = productInput.value || (productInput.options && productInput.selectedIndex >= 0 ? productInput.options[productInput.selectedIndex].text : '');
            } else if (membersInput) {
                if (window.location.pathname.includes('finance')) {
                    interest = `Pigmy Application (${membersInput.value} active agents)`;
                } else if (window.location.pathname.includes('cluvana')) {
                    interest = `Cluvana Hospitality (${membersInput.value} members)`;
                } else {
                    interest = membersInput.value;
                }
            } else {
                interest = 'Software Demo & Architecture Walkthrough';
            }

            // WhatsApp formatted message template
            const whatsappMessage =
                `*Demo Required*

Name: ${name}
B/O: ${club}
Email: ${email}
Phone: ${phone}
Interest: ${interest}`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

            // Open WhatsApp directly in response to user submit click
            window.open(whatsappUrl, '_blank');

            // Display confirmation card with instant fallback button
            formContainer.innerHTML = `
                <div style="text-align: center; padding: 24px 8px;">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(0, 200, 83, 0.15); color: #00C853; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 26px;">
                        ✓
                    </div>
                    <h3 style="color: #FFFFFF; font-size: 22px; margin-bottom: 8px;">Opening WhatsApp...</h3>
                    <p style="color: #B0B0B0; font-size: 15px; max-width: 420px; margin: 0 auto 20px auto; line-height: 1.6;">
                        Thank you, <strong class="gradient-color-2">${name}</strong>! Your demo request details for <strong style="color: #FFFFFF;">${club}</strong> have been prepared for Softbros (+91 8431027977).
                    </p>
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px dashed var(--border-color); border-radius: 8px; padding: 14px; margin-bottom: 20px; text-align: left; font-family: monospace; font-size: 13px; color: #E0E0E0; white-space: pre-wrap; line-height: 1.5;">${whatsappMessage.replace(/\*/g, '')}</div>
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px; font-size: 15px; margin-bottom: 12px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.477-.15-.678.15-.2.301-.778.979-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.785-1.676-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.636-.929-2.241-.244-.59-.492-.51-.677-.52l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.378.197 1.897.12.579-.087 1.78-.727 2.032-1.43.251-.702.251-1.303.176-1.43-.075-.126-.276-.201-.577-.352z"/>
                            <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.947.558 3.766 1.523 5.307L2.05 22l4.832-1.428A9.957 9.957 0 0 0 12.004 22C17.524 22 22 17.52 22 12s-4.476-10-9.996-10zm0 18.2c-1.635 0-3.155-.494-4.428-1.341l-.317-.212-2.871.849.866-2.776-.233-.339A8.17 8.17 0 0 1 3.82 12c0-4.512 3.672-8.18 8.184-8.18 4.513 0 8.184 3.668 8.184 8.18 0 4.513-3.671 8.2-8.184 8.2z"/>
                        </svg>
                        Click here if WhatsApp didn't open
                    </a>
                    <div>
                        <button type="button" id="reset-demo-form-btn" style="background: none; border: none; color: #888888; text-decoration: underline; cursor: pointer; font-size: 13px; margin-top: 8px;">
                            ← Submit another request
                        </button>
                    </div>
                </div>
            `;

            const resetBtn = document.getElementById('reset-demo-form-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    formContainer.innerHTML = originalFormHtml;
                    const restoredForm = document.getElementById('demo-request-form');
                    if (restoredForm) {
                        attachFormHandler(restoredForm);
                    }
                });
            }
        });
    }

    attachFormHandler(form);
}