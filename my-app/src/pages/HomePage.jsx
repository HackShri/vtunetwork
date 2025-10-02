import { Link, useNavigate } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FileText, Github, Linkedin, Twitter, Mail, ChevronDown } from "lucide-react"
import Header from "@/components/Header"
import { useSelector } from "react-redux"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import SubjectSlider from '@/components/SubjectSlider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { branches as allBranches, semSubjects, subjects, semesters, getSubjects, getSubjectCode } from "@/common/data"

export default function HomePage() {
    const navigate = useNavigate()
    const user = useSelector(state => state)
    console.log(user)

    // Slides content for hero
    const slides = useMemo(() => ([
        { title: "Welcome to VTU Network", subtitle: "Connect with students on WhatsApp and Telegram" },
        { title: "All Your Notes At One Place", subtitle: "Semester notes, lab manuals and previous papers" },
        { title: "Study Smarter Together", subtitle: "Join the community and start learning now" },
    ]), [])
    const [active, setActive] = useState(0)
    useEffect(() => {
        const id = setInterval(() => setActive((p) => (p + 1) % slides.length), 3500)
        return () => clearInterval(id)
    }, [slides.length])

    // Dropdown filters
    const [selectedBranch, setSelectedBranch] = useState(allBranches?.[0]?.id || "cse")
    const semKey = "Sem 1"
    const subjectCodes = useMemo(() => {
        const codes = semSubjects?.[selectedBranch]?.[semKey]
        return Array.isArray(codes) ? codes : []
    }, [selectedBranch])
    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            {/* Fixed Header */}
            {/* <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <img className="h-8 w-8 text-orange-500" />
                            <span className="text-xl font-bold text-white">VTU Network</span>
                        </Link>
                        <nav className="hidden md:flex space-x-8">
                            <Link href="#home" className="text-gray-300 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                                Features
                            </Link>
                            <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">
                                FAQ
                            </Link>
                            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                                About
                            </Link>
                        </nav>
                        <button className="md:hidden text-gray-300 hover:text-white">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header> */}

            {/* Hero Section - Auto sliding like Netflix */}
            <section id="home" className="w-full pt-20 md:pt-28 bg-gray-900">

                <div className="relative w-full h-[40vh] overflow-hidden">
                    {slides.map((s, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${active === idx ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="h-full w-full bg-gray-900 flex items:center justify-center text-center px-6">
                                <div>
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">{s.title}</h1>
                                    <p className="mt-4 max-w-2xl mx-auto text-gray-300 text-lg md:text-xl">{s.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => setActive(i)} className={`h-2 w-8 rounded-full ${active === i ? 'bg-white' : 'bg-white/40'}`} aria-label={`slide-${i}`} />
                        ))}
                    </div>
                </div>


                {/* Control bar moved outside gray hero */}
            </section>

            {/* Control bar under hero (outside gray background) */}


            {/* Features Section */}
            <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center space-y-4 text-center mb-12">
                        <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                            Everything You Need for Academic Success

                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                            Discover a comprehensive collection of resources designed to help VTU students excel in their studies.

                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-lg transition-all hover:shadow-xl hover:border-gray-600 hover:bg-gray-800"
                            >
                                <div className="flex flex-col items-center space-y-4 text-center">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                    <p className="text-sm text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="container px-4 md:px-6 mx-auto mt-4 pb-8">
                    <div className="flex flex-wrap gap-4">
                        {/* Connect */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-white text-black hover:bg-gray-200">Connect <ChevronDown className="ml-2 h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-900 text-white border border-gray-700">
                                <DropdownMenuLabel>Join our channels</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => window.open('https://whatsapp.com', '_blank')}>WhatsApp Channel</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open('https://t.me', '_blank')}>Telegram</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Branch */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-white text-black hover:bg-gray-200">Branch: {allBranches.find(b => b.id === selectedBranch)?.name?.split(' ')[0] || selectedBranch.toUpperCase()} <ChevronDown className="ml-2 h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-900 text-white border border-gray-700">
                                {allBranches.map((b) => (
                                    <DropdownMenuItem key={b.id} onClick={() => setSelectedBranch(b.id)}>{b.name}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Notes categories */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-white text-black hover:bg-gray-200">Notes <ChevronDown className="ml-2 h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-900 text-white border border-gray-700">
                                <DropdownMenuItem onClick={() => navigate('/notes')}>Notes</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/notes')}>Lab Notes</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/notes')}>Question Papers</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="container px-4 md:px-6 mx-auto">
                    {/* Netflix-style horizontal sliders for each semester */}
                    {semesters.map((sem) => {
                        const semKeyLocal = sem
                        const codes = semSubjects?.[selectedBranch]?.[semKeyLocal] || []
                        const names = getSubjects(selectedBranch, semKeyLocal)
                        // Pair names with codes by index when possible
                        const items = (names.length ? names : codes).map((nameOrCode, idx) => {
                            const subjectName = names[idx] || nameOrCode
                            const code = codes[idx] || nameOrCode
                            return { subjectName, code }
                        })
                        return (
                            <SubjectSlider
                                key={semKeyLocal}
                                semester={semKeyLocal}
                                items={items}
                                selectedBranch={selectedBranch}
                            />
                        );
                    })}


                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                            Get answers to common questions about our platform
                        </p>
                    </div>
                    <div className="mx-auto max-w-3xl">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                                    <AccordionTrigger className="text-white hover:text-gray-300 text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                            Meet the Creators
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                            We built this platform to make the availability of the notes easier
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {creators.map((creator, index) => (
                            <div key={index} className="flex flex-col items-center space-y-4 text-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                    {creator.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{creator.name}</h3>
                                    <p className="text-sm font-medium text-orange-400">{creator.role}</p>
                                    <p className="mt-2 text-sm text-gray-300">{creator.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Footer Section */}
            <footer className="w-full py-12 bg-black text-gray-300">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <img src="/enchancedimage.png" className="h-8 w-8 text-orange-500" />
                                <span className="text-xl font-bold text-white">VTU Network </span>
                            </Link>
                            <p className="text-sm text-gray-400">A notes and papers and learning platform </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <a href="#home" className="block hover:text-white transition-colors">
                                    Home
                                </a>
                                <a href="#features" className="block hover:text-white transition-colors">
                                    Features
                                </a>
                                <a href="#faq" className="block hover:text-white transition-colors">
                                    FAQ
                                </a>
                                <a href="#about" className="block hover:text-white transition-colors">
                                    About
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                            <div className="space-y-2">
                                <Link
                                    href="mailto:contact@pdfcloud.com"
                                    className="flex items-center space-x-2 hover:text-white transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span>Contact Us</span>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Github className="h-6 w-6" />
                                    <span className="sr-only">GitHub</span>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Linkedin className="h-6 w-6" />
                                    <span className="sr-only">LinkedIn</span>
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <Twitter className="h-6 w-6" />
                                    <span className="sr-only">Twitter</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400">© 2025 VTU Network. Built with ❤️ for seamless  sharing.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Features data
const features = [
    {
        icon: <FileText className="w-12 h-12 text-blue-500" />,
        title: "Semester Notes",
        description:
            "Access comprehensive notes for all VTU subjects and semesters.",
    },
    {
        icon: <FileText className="w-12 h-12 text-green-500" />,
        title: "Previous Papers",
        description:
            "Download previous year question papers to ace your exams.",
    },
    {
        icon: <FileText className="w-12 h-12 text-yellow-500" />,
        title: "Student Community",
        description:
            "Connect with fellow students and share knowledge.",
    },
    {
        icon: <FileText className="w-12 h-12 text-yellow-500" />,
        title: "Academic Resources",
        description:
            "Find syllabus, lab manuals, and other academic materials.",
    },
];


// FAQ data
const faqs = [
    {
        question: "What kind of notes can I upload?",
        answer:
            "You can upload engineering subject notes in PDF format. Ensure your files are well-organized and clearly named for easier access.",
    },
    {
        question: "Who can see my uploaded notes?",
        answer:
            "Currently, notes are visible to you only. We're working on a sharing system so your classmates can also benefit.",
    },
    {
        question: "Is there a limit to how many PDFs I can upload?",
        answer:
            "There's no strict limit right now. Upload as many class notes as you need, but please avoid duplicate or irrelevant files.",
    },
];


// Creators data
const creators = [
    {
        name: "Murari U",
        role: "Full Stack Developer",
        bio: "Backend architecture and cloud infrastructure specialist",
    },
    {
        name: "Shrinivas H K ",
        role: "Frontend Developer",
        bio: "UI/UX design and responsive web development expert",
    },
    {
        name: "Sharath B ",
        role: "DevOps Engineer",
        bio: "Deployment automation and system reliability engineer",
    },
]
