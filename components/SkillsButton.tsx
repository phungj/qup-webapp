type SkillsButtonProps = {
    showSkills: () => void
}

export function SkillsButton({ showSkills }: SkillsButtonProps) {
    return <button onClick={showSkills} className="btn btn-secondary">
        Skills
    </button>;
}