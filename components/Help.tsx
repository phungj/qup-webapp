import TitleItalics from "@/components/TitleItalics";
import Image from "next/image";
import grid from "@/public/grid.png";
import {SKILLS} from "@/src/skills";
import SkillCard from "@/components/SkillCard";

// TODO: Get this syntax highlighted
// TODO: Refactor this with a factory
// TODO: Return to motion animation with this one day
export default function Help() {
    return (
        <div className="text-center flex flex-col items-center">
            <div className="mt-5">
                <TitleItalics/>
            </div>
            <h1 className="font-title text-heading text-3xl font-bold mt-10 mb-2">What is <span className="text-yellow-300">Q-UP</span>?</h1>
            <h2 className="text-2xl mb-10"><span className="text-yellow-300">Q-UP</span> is <span className="font-bold">the</span> coin flipping eSport where every round is completely fair.</h2>
            <h1 className="font-title text-heading text-3xl font-bold mb-2">What is my goal?</h1>
            <h2 className="text-2xl mb-12">Obtain as much Q as possible.</h2>
            <h1 className="font-title text-heading text-3xl font-bold mb-2">How do I obtain Q?</h1>
            <h2 className="text-2xl mb-13">Set up a skill grid and play matches.</h2>
            <h1 className="font-title text-heading text-3xl font-bold mb-2">How do I set up a skill grid?</h1>
            <h2 className="text-2xl mb-12">Skill grids are loaded using the following JSON specification and coordinate system.</h2>
            <div className="flex mb-12">
                <pre className="bg-base-200 p-4 rounded font-mono text-sm overflow-x-auto text-left mb-5">
                    <code>
                            {`
                            
                            
                            
                            
                            
    {
        "skills": [
            {
                "id": string,
                "q": int,
                "r": int
            },
        ]
    }
                            `}
                    </code>
                </pre>
                <Image src={grid}
                       alt="A pointy-top-up hexagonal grid labeled with coordinates where columns are the first coordinate and positive to the right and the top-left to bottom-right diagonal is the second coordinate and positive to the bottom left."
                       width={500}
                       height={500}/>
            </div>
            <h2 className="text-2xl mb-12">Each grid may only have one skill at each hex and one copy of each skill.</h2>
            <h1  className="font-title text-heading text-3xl font-bold mb-2">What skills are there?</h1>
            <div className="grid grid-cols-3 gap-4">
                {SKILLS.map((skill, i) => (
                    <SkillCard key={i} skill={skill} />
                ))}
            </div>
        </div>
    );
}