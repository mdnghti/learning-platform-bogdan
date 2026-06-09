const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Material = require('../models/Material');
const Test = require('../models/Test');
const Question = require('../models/Question');

const seedDatabase = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@learnhub.com' });
    if (adminExists) return;
    console.log('Seeding database...');

    const admin = await User.create({ email: 'admin@learnhub.com', password: 'admin123', firstName: 'Admin', lastName: 'System', role: 'admin' });
    const teacher = await User.create({ email: 'teacher@learnhub.com', password: 'teacher123', firstName: 'John', lastName: 'Doe', role: 'teacher', bio: 'Experienced computer science instructor' });
    const student = await User.create({ email: 'student@learnhub.com', password: 'student123', firstName: 'Jane', lastName: 'Smith', role: 'student' });

    // ====== COMPUTER ELECTRONICS COURSE ======
    const electronicsCourse = await Course.create({
      title: 'Computer Electronics',
      description: 'Master the fundamentals of computer electronics: semiconductor physics, diodes, transistors, amplifiers, and integrated circuits. This course provides a comprehensive understanding of electronic components and their role in modern computing systems.',
      teacher: teacher._id,
      category: 'electronics',
      difficulty: 'intermediate',
      isPublished: true,
    });

    const elecMod1 = await Module.create({ title: 'Semiconductor Fundamentals', course: electronicsCourse._id, order: 1 });
    const elecMod2 = await Module.create({ title: 'Diodes and Applications', course: electronicsCourse._id, order: 2 });
    const elecMod3 = await Module.create({ title: 'Transistors and Amplifiers', course: electronicsCourse._id, order: 3 });
    const elecMod4 = await Module.create({ title: 'Operational Amplifiers', course: electronicsCourse._id, order: 4 });
    const elecMod5 = await Module.create({ title: 'Digital Logic Families', course: electronicsCourse._id, order: 5 });

    electronicsCourse.modules = [elecMod1._id, elecMod2._id, elecMod3._id, elecMod4._id, elecMod5._id];
    electronicsCourse.students.push(student._id);
    await electronicsCourse.save();

    // Module 1 Materials
    await Material.create({ title: 'Introduction to Semiconductors', description: 'Understanding the basic properties of semiconductors, band theory, and doping.', type: 'document', content: 'Semiconductors are materials with electrical conductivity between conductors and insulators. Silicon and germanium are the most common semiconductor materials. Through doping, we can create n-type (excess electrons) and p-type (excess holes) materials that form the basis of all modern electronics.', module: elecMod1._id, course: electronicsCourse._id, order: 1 });
    await Material.create({ title: 'P-N Junction Formation', description: 'How P-N junctions are formed and their basic properties.', type: 'document', content: 'When p-type and n-type semiconductors are joined, a P-N junction is formed. At the junction, electrons from the n-side diffuse into the p-side, and holes from the p-side diffuse into the n-side, creating a depletion region. This region acts as a barrier to further charge flow and is the fundamental building block of diodes and transistors.', module: elecMod1._id, course: electronicsCourse._id, order: 2 });
    await Material.create({ title: 'Energy Band Diagrams', description: 'Visualizing energy bands in semiconductors.', type: 'presentation', content: 'Energy band diagrams show the conduction band, valence band, and band gap of semiconductor materials. The Fermi level indicates the energy state with 50% probability of electron occupancy.', module: elecMod1._id, course: electronicsCourse._id, order: 3 });

    // Module 2 Materials
    await Material.create({ title: 'Diode Characteristics', description: 'Understanding the V-I characteristics of diodes.', type: 'document', content: 'A diode allows current to flow in only one direction. In forward bias, current increases exponentially with voltage. In reverse bias, only a small leakage current flows until breakdown voltage is reached. The V-I characteristic curve shows these regions clearly.', module: elecMod2._id, course: electronicsCourse._id, order: 1 });
    await Material.create({ title: 'Rectifier Circuits', description: 'Half-wave and full-wave rectification.', type: 'document', content: 'Rectifiers convert AC to DC. A half-wave rectifier uses one diode and conducts during only one half-cycle. A full-wave rectifier uses multiple diodes to conduct during both half-cycles, producing smoother DC output with less ripple.', module: elecMod2._id, course: electronicsCourse._id, order: 2 });
    await Material.create({ title: 'Zener Diodes and Voltage Regulation', description: 'Using Zener diodes for voltage regulation.', type: 'lecture', content: 'Zener diodes operate in reverse breakdown region and maintain a constant voltage across them. They are used in voltage regulator circuits to provide stable reference voltages.', module: elecMod2._id, course: electronicsCourse._id, order: 3 });

    // Module 3 Materials
    await Material.create({ title: 'BJT Transistors', description: 'Bipolar Junction Transistor operation and biasing.', type: 'document', content: 'BJTs are three-terminal devices (emitter, base, collector) that amplify current. NPN and PNP are the two types. In common-emitter configuration, a small base current controls a larger collector current, providing current gain (beta).', module: elecMod3._id, course: electronicsCourse._id, order: 1 });
    await Material.create({ title: 'MOSFET Transistors', description: 'Metal-Oxide-Semiconductor Field-Effect Transistors.', type: 'document', content: 'MOSFETs are voltage-controlled devices. The gate voltage creates an electric field that controls current flow between source and drain. They are the building blocks of modern digital integrated circuits and CMOS technology.', module: elecMod3._id, course: electronicsCourse._id, order: 2 });
    await Material.create({ title: 'Common-Emitter Amplifier', description: 'Design and analysis of CE amplifier circuits.', type: 'lecture', content: 'The common-emitter amplifier provides high voltage gain. Key design parameters include biasing resistors, coupling capacitors, and load resistance. The voltage gain is approximately Av = -Rc/Re.', module: elecMod3._id, course: electronicsCourse._id, order: 3 });

    // Module 4 Materials
    await Material.create({ title: 'Op-Amp Fundamentals', description: 'Introduction to operational amplifiers.', type: 'document', content: 'Operational amplifiers are high-gain differential voltage amplifiers with very high input impedance and low output impedance. They are used in inverting, non-inverting, summing, and integrating configurations.', module: elecMod4._id, course: electronicsCourse._id, order: 1 });
    await Material.create({ title: 'Op-Amp Applications', description: 'Practical op-amp circuits and their applications.', type: 'document', content: 'Common op-amp applications include comparators, filters, oscillators, and instrumentation amplifiers. Negative feedback determines the closed-loop gain and improves linearity.', module: elecMod4._id, course: electronicsCourse._id, order: 2 });

    // Module 5 Materials
    await Material.create({ title: 'TTL Logic', description: 'Transistor-Transistor Logic family.', type: 'document', content: 'TTL is a popular logic family using BJTs. Standard TTL uses totem-pole output stages. Key characteristics include propagation delay, noise margin, fan-out, and power dissipation.', module: elecMod5._id, course: electronicsCourse._id, order: 1 });
    await Material.create({ title: 'CMOS Logic', description: 'Complementary Metal-Oxide-Semiconductor logic.', type: 'document', content: 'CMOS uses complementary pairs of p-type and n-type MOSFETs. It offers very low static power consumption and high noise immunity. Power is only consumed during switching transitions.', module: elecMod5._id, course: electronicsCourse._id, order: 2 });

    // Electronics Tests
    const electronicsTest = await Test.create({
      title: 'Computer Electronics Fundamentals Quiz',
      description: 'Test your understanding of semiconductor physics, diodes, transistors, and logic families.',
      course: electronicsCourse._id,
      teacher: teacher._id,
      timeLimit: 45,
      maxAttempts: 2,
      passingScore: 70,
      isPublished: true,
    });

    const makeQ = async (testId, text, type, options, correctAnswer, points) => {
      return Question.create({ test: testId, type, text, options, correctAnswer, points, order: 0 });
    };

    const eq1 = await makeQ(electronicsTest._id, 'What is the most common semiconductor material used in modern electronics?', 'single_choice',
      [{ label: 'Silicon', value: 'silicon' }, { label: 'Germanium', value: 'germanium' }, { label: 'Gallium Arsenide', value: 'gaas' }, { label: 'Copper', value: 'copper' }],
      'silicon', 5);
    const eq2 = await makeQ(electronicsTest._id, 'In a P-N junction, the depletion region contains:', 'single_choice',
      [{ label: 'Free electrons and holes', value: 'free' }, { label: 'Only electrons', value: 'electrons' }, { label: 'Only holes', value: 'holes' }, { label: 'Ionized donor and acceptor atoms', value: 'ions' }],
      'ions', 5);
    const eq3 = await makeQ(electronicsTest._id, 'Which of the following are types of transistors?', 'multiple_choice',
      [{ label: 'BJT', value: 'bjt' }, { label: 'MOSFET', value: 'mosfet' }, { label: 'LED', value: 'led' }, { label: 'JFET', value: 'jfet' }],
      ['bjt', 'mosfet', 'jfet'], 5);
    const eq4 = await makeQ(electronicsTest._id, 'A diode in forward bias conducts current.', 'true_false',
      [{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }],
      'true', 3);
    const eq5 = await makeQ(electronicsTest._id, 'CMOS logic consumes significant power even when not switching.', 'true_false',
      [{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }],
      'false', 3);

    electronicsTest.questions = [eq1._id, eq2._id, eq3._id, eq4._id, eq5._id];
    await electronicsTest.save();

    // ====== COMPUTER LOGIC COURSE ======
    const logicCourse = await Course.create({
      title: 'Computer Logic',
      description: 'Explore the foundations of digital logic: Boolean algebra, logic gates, combinational and sequential circuits, and computer arithmetic. This course bridges the gap between electronics and computer architecture.',
      teacher: teacher._id,
      category: 'logic',
      difficulty: 'beginner',
      isPublished: true,
    });

    const logicMod1 = await Module.create({ title: 'Boolean Algebra', course: logicCourse._id, order: 1 });
    const logicMod2 = await Module.create({ title: 'Logic Gates', course: logicCourse._id, order: 2 });
    const logicMod3 = await Module.create({ title: 'Combinational Circuits', course: logicCourse._id, order: 3 });
    const logicMod4 = await Module.create({ title: 'Sequential Circuits', course: logicCourse._id, order: 4 });
    const logicMod5 = await Module.create({ title: 'Computer Arithmetic', course: logicCourse._id, order: 5 });

    logicCourse.modules = [logicMod1._id, logicMod2._id, logicMod3._id, logicMod4._id, logicMod5._id];
    logicCourse.students.push(student._id);
    await logicCourse.save();

    student.enrolledCourses = [electronicsCourse._id, logicCourse._id];
    await student.save();

    // Module 1 Materials
    await Material.create({ title: 'Introduction to Boolean Algebra', description: 'Basic concepts and axioms of Boolean algebra.', type: 'document', content: 'Boolean algebra deals with binary variables (0 and 1) and logical operations. The basic operations are AND (.), OR (+), and NOT (\'). Key laws include commutative, associative, distributive, De Morgan\'s laws, and duality principle.', module: logicMod1._id, course: logicCourse._id, order: 1 });
    await Material.create({ title: 'Boolean Functions and Truth Tables', description: 'Representing Boolean functions using truth tables.', type: 'document', content: 'A Boolean function maps binary inputs to binary outputs. Truth tables list all possible input combinations and corresponding outputs. Canonical forms include Sum-of-Products (SOP) and Product-of-Sums (POS).', module: logicMod1._id, course: logicCourse._id, order: 2 });
    await Material.create({ title: 'Karnaugh Maps', description: 'Simplifying Boolean expressions using K-maps.', type: 'lecture', content: 'Karnaugh maps provide a graphical method for simplifying Boolean expressions. Group adjacent 1s in powers of 2 to form prime implicants. K-maps work for up to 5 variables efficiently.', module: logicMod1._id, course: logicCourse._id, order: 3 });

    // Module 2 Materials
    await Material.create({ title: 'Basic Logic Gates', description: 'AND, OR, NOT, NAND, NOR, XOR, XNOR gates.', type: 'document', content: 'Logic gates are the building blocks of digital circuits. AND outputs 1 only when all inputs are 1. OR outputs 1 when at least one input is 1. NOT inverts the input. NAND and NOR are universal gates (any circuit can be built using only NAND or only NOR gates). XOR outputs 1 when inputs differ.', module: logicMod2._id, course: logicCourse._id, order: 1 });
    await Material.create({ title: 'Universal Gates', description: 'Implementing any circuit with NAND or NOR gates.', type: 'document', content: 'NAND and NOR gates are called universal because any Boolean function can be implemented using only these gates. This property is crucial for IC manufacturing where using a single gate type reduces costs.', module: logicMod2._id, course: logicCourse._id, order: 2 });
    await Material.create({ title: 'Gate-Level Minimization', description: 'Optimizing logic circuits.', type: 'lecture', content: 'Gate-level minimization reduces the number of gates and inputs, lowering cost and power consumption. Techniques include algebraic simplification, K-maps, and Quine-McCluskey algorithm.', module: logicMod2._id, course: logicCourse._id, order: 3 });

    // Module 3 Materials
    await Material.create({ title: 'Adders and Subtractors', description: 'Half adders, full adders, ripple-carry adders.', type: 'document', content: 'A half adder adds two bits producing sum and carry. A full adder adds three bits (two inputs plus carry-in). Ripple-carry adders chain full adders for multi-bit addition. Carry-lookahead adders improve speed by computing carries in parallel.', module: logicMod3._id, course: logicCourse._id, order: 1 });
    await Material.create({ title: 'Multiplexers and Demultiplexers', description: 'Data selection and distribution circuits.', type: 'document', content: 'A multiplexer (MUX) selects one of many inputs based on select lines. A demultiplexer (DEMUX) routes a single input to one of many outputs. These are essential in data routing and communication circuits.', module: logicMod3._id, course: logicCourse._id, order: 2 });
    await Material.create({ title: 'Encoders and Decoders', description: 'Converting between binary representations.', type: 'document', content: 'Encoders convert multiple input lines into a smaller binary code. Decoders do the reverse - they convert a binary code into active output lines. Priority encoders handle multiple active inputs by prioritizing the highest-order input.', module: logicMod3._id, course: logicCourse._id, order: 3 });

    // Module 4 Materials
    await Material.create({ title: 'Latches and Flip-Flops', description: 'Basic memory elements in digital circuits.', type: 'document', content: 'Latches are level-sensitive memory elements. Flip-flops are edge-triggered. Common types: SR, D, JK, and T flip-flops. D flip-flops are most commonly used in modern digital design due to their simplicity.', module: logicMod4._id, course: logicCourse._id, order: 1 });
    await Material.create({ title: 'Counters and Registers', description: 'Sequential circuits for counting and storage.', type: 'document', content: 'Counters are sequential circuits that go through a predetermined sequence of states. Registers store multiple bits using arrays of flip-flops. Shift registers can shift data left or right, useful in serial communication.', module: logicMod4._id, course: logicCourse._id, order: 2 });
    await Material.create({ title: 'Finite State Machines', description: 'Designing sequential circuits using state diagrams.', type: 'lecture', content: 'FSMs have a finite number of states and transition between them based on inputs. Mealy machines output depends on current state and inputs. Moore machines output depends only on current state.', module: logicMod4._id, course: logicCourse._id, order: 3 });

    // Module 5 Materials
    await Material.create({ title: 'Binary Number Systems', description: 'Representing numbers in binary, octal, hexadecimal.', type: 'document', content: 'Computers use binary (base-2) natively. Octal (base-8) and hexadecimal (base-16) are convenient representations. Conversion between bases uses positional notation. Two\'s complement represents signed numbers.', module: logicMod5._id, course: logicCourse._id, order: 1 });
    await Material.create({ title: 'Signed Number Representations', description: 'Sign-magnitude, one\'s complement, two\'s complement.', type: 'document', content: 'Two\'s complement is the most common signed representation. To negate: invert all bits and add 1. It simplifies addition/subtraction hardware because subtraction becomes addition of a negated number.', module: logicMod5._id, course: logicCourse._id, order: 2 });
    await Material.create({ title: 'ALU Design', description: 'Arithmetic Logic Unit architecture.', type: 'lecture', content: 'The ALU performs arithmetic and logic operations. A simple ALU might support addition, subtraction, AND, OR, XOR, and comparison. The control lines select the operation. Flags (zero, carry, overflow, negative) report status.', module: logicMod5._id, course: logicCourse._id, order: 3 });

    // Logic Tests
    const logicTest = await Test.create({
      title: 'Computer Logic Fundamentals Quiz',
      description: 'Test your knowledge of Boolean algebra, logic gates, combinational and sequential circuits.',
      course: logicCourse._id,
      teacher: teacher._id,
      timeLimit: 45,
      maxAttempts: 2,
      passingScore: 70,
      isPublished: true,
    });

    const lq1 = await makeQ(logicTest._id, 'Which of the following is a universal gate?', 'single_choice',
      [{ label: 'AND', value: 'and' }, { label: 'OR', value: 'or' }, { label: 'NAND', value: 'nand' }, { label: 'XOR', value: 'xor' }],
      'nand', 5);
    const lq2 = await makeQ(logicTest._id, 'De Morgan\'s law states: (A + B)\' =', 'single_choice',
      [{ label: 'A\' + B\'', value: 'a' }, { label: 'A\' · B\'', value: 'b' }, { label: 'A · B', value: 'c' }, { label: '(A · B)\'', value: 'd' }],
      'b', 5);
    const lq3 = await makeQ(logicTest._id, 'Which of the following are edge-triggered memory elements?', 'multiple_choice',
      [{ label: 'SR Latch', value: 'sr' }, { label: 'D Flip-Flop', value: 'dff' }, { label: 'JK Flip-Flop', value: 'jk' }, { label: 'Transparent Latch', value: 'tl' }],
      ['dff', 'jk'], 5);
    const lq4 = await makeQ(logicTest._id, 'In two\'s complement representation, negating a number involves inverting all bits and adding 1.', 'true_false',
      [{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }],
      'true', 3);
    const lq5 = await makeQ(logicTest._id, 'A multiplexer with 8 data inputs requires how many select lines?', 'single_choice',
      [{ label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '8', value: '8' }],
      '3', 5);

    logicTest.questions = [lq1._id, lq2._id, lq3._id, lq4._id, lq5._id];
    await logicTest.save();

    console.log('Database seeded successfully!');
    console.log('  Admin:    admin@learnhub.com / admin123');
    console.log('  Teacher:  teacher@learnhub.com / teacher123');
    console.log('  Student:  student@learnhub.com / student123');
    console.log('  Courses:  Computer Electronics, Computer Logic');
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedDatabase;
