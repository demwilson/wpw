[
    {
        "name": "Weapon and Armor Proficiency (Paladin)",
        "type": "",
        "text": "Paladins are proficient with all simple and martial weapons, with all types of armor (heavy, medium, and light), and with shields (except tower shields).",
        "formula": {
            "proficient": {
                "weapon": [
                    "simple",
                    "martial"
                ],
                "armor": [
                    "light",
                    "medium",
                    "heavy",
                    "shield"
                ]
            }
        },
        "level": 1
    },
    {
        "name": "Aura of Good",
        "type": "Ex",
        "text": "The power of a paladin's aura of good (see the detect good spell) is equal to her paladin level.",
        "formula": {
            "aura": "good"
        },
        "tags": [
            "special quality"
        ],
        "level": 1
    },
    {
        "name": "Detect Evil",
        "type": "Sp",
        "text": "At will, a paladin can use detect evil, as the spell. A paladin can, as a move action, concentrate on a single item or individual within 60 feet and determine if it is evil, learning the strength of its aura as if having studied it for 3 rounds. While focusing on one individual or object, the paladin does not detect evil in any other object or individual within range.",
        "formula": {
            "classes": {
                "paladin": {
                    "spelllike": {
                        "at will": "detect evil"
                    }
                }
            }
        },
        "level": 1
    },
    {
        "name": "Smite Evil",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {
            "classes": {
                "paladin": {
                    "special attacks": [
                        {
                            "name": "smite evil",
                            "formula": [
                                "floor( 1 + ( classes[\"paladin\"].level - 1 ) / 3 )"
                            ],
                            "extratext": "{{0}}/day"
                        }
                    ]
                }
            }
        },
        "level": 1
    },
    {
        "name": "Smite Evil (2/day)",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {},
        "level": 4,
        "hide": true
    },
    {
        "name": "Smite Evil (3/day)",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {},
        "level": 7,
        "hide": true
    },
    {
        "name": "Smite Evil (4/day)",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {},
        "level": 10,
        "hide": true
    },
    {
        "name": "Smite Evil (5/day)",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {},
        "level": 13,
        "hide": true
    },
    {
        "name": "Smite Evil (6/day)",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {},
        "level": 16,
        "hide": true
    },
    {
        "name": "Smite Evil (7/day)",
        "type": "Su",
        "text": "Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.\n\n     In addition, while smite evil is in effect, the paladin gains a deflection bonus equal to her Charisma modifier (if any) to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.\n\nThe smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability. At 4th level, and at every three levels thereafter, the paladin may smite evil one additional time per day, as indicated on Table: Paladin, to a maximum of seven times per day at 19th level.",
        "formula": {},
        "level": 19,
        "hide": true
    },
    {
        "name": "Divine Grace",
        "type": "Su",
        "text": "At 2nd level, a paladin gains a bonus equal to her Charisma bonus (if any) on all Saving Throws.",
        "formula": {
            "saves": {
                "fortitude": {
                    "add": {
                        "type": "untyped",
                        "value": "scores.charisma.modifier()"
                    }
                },
                "reflex": {
                    "add": {
                        "type": "untyped",
                        "value": "scores.charisma.modifier()"
                    }
                },
                "will": {
                    "add": {
                        "type": "untyped",
                        "value": "scores.charisma.modifier()"
                    }
                }
            },
            "classes": {
                "paladin": {
                    "defensive ability": [
                        {
                            "name": "Divine Grace",
                            "formula": [
                                "scores.charisma.modifier()"
                            ],
                            "extratext": "+{{f}}"
                        }
                    ]
                }
            }
        },
        "level": 2
    },
    {
        "name": "Lay on Hands",
        "type": "Su",
        "text": "Beginning at 2nd level, a paladin can heal wounds (her own or those of others) by touch. Each day she can use this ability a number of times equal to 1/2 her paladin level plus her Charisma modifier. With one use of this ability, a paladin can heal 1d6 hit points of damage for every two paladin levels she possesses. Using this ability is a standard action, unless the paladin targets herself, in which case it is a swift action. Despite the name of this ability, a paladin only needs one free hand to use this ability.\n\nAlternatively, a paladin can use this healing power to deal damage to undead creatures, dealing 1d6 points of damage for every two levels the paladin possesses. Using lay on hands in this way requires a successful melee touch attack and doesn't provoke an attack of opportunity. Undead do not receive a saving throw against this damage.",
        "formula": {
            "classes": {
                "paladin": {
                    "special quality": [
                        {
                            "name": "lay on hands",
                            "formula": [
                                "floor(classes[\"paladin\"].level/2) + 4",
                                "floor(classes[\"paladin\"].level/2)"
                            ],
                            "extratext": "{{1}}d6, {{0}}/day"
                        }
                }
]
}
}
},
"level": 2
},
{
    "name": "Aura of Courage",
    "type": "Su",
    "text": "At 3rd level, a paladin is immune to fear (magical or otherwise). Each ally within 10 feet of her gains a +4 morale bonus on saving throws against fear effects. This ability functions only while the paladin is conscious, not if she is unconscious or dead.",
    "formula": {
    "classes": {
        "paladin": {
            "immune": [
                "fear"
            ]
        }
    }
},
    "level": 3
},
{
    "name": "Divine Health",
    "type": "Ex",
    "text": "At 3rd level, a paladin is immune to all diseases, including supernatural and magical diseases, including mummy rot.",
    "formula": {
    "classes": {
        "paladin": {
            "immune": [
                "disease"
            ]
        }
    }
},
    "level": 3
},
{
    "name": "Mercy",
    "type": "Su",
    "text": "At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin's lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin. A mercy can remove a condition caused by a curse, disease, or poison without curing the affliction. Such conditions return after 1 hour unless the mercy actually removes the affliction that causes the condition.<br><br>At 3rd level, the paladin can select from the following initial mercies.<ul><li><b>Fatigued</b>: The target is no longer fatigued.</li><li><b>Shaken</b>: The target is no longer shaken.</li><li><b>Sickened</b>: The target is no longer sickened.</li></ul><br>At 6th level, a paladin adds the following mercies to the list of those that can be selected.<ul><li><b>Dazed</b>: The target is no longer dazed.</li><li><b>Diseased</b>: The paladin's lay on hands ability also acts as remove disease, using the paladin's level as the caster level.</li><li><b>Staggered</b>: The target is no longer staggered, unless the target is at exactly 0 hit points.</li></ul>At 9th level, a paladin adds the following mercies to the list of those that can be selected.<br><ul><li><b>Cursed</b>: The paladin's lay on hands ability also acts as remove curse, using the paladin's level as the caster level.</li><li><b>Exhausted</b>: The target is no longer exhausted. The paladin must have the fatigue mercy before selecting this mercy.Frightened: The target is no longer frightened. The paladin must have the shaken mercy before selecting this mercy.</li><li><b>Nauseated</b>: The target is no longer nauseated. The paladin must have the sickened mercy before selecting this mercy.</li><li><b>Poisoned</b>: The paladin's lay on hands ability also acts as neutralize poison, using the paladin's level as the caster level.<br>At 12th level, a paladin adds the following mercies to the list of those that can be selected.</li><br><ul><li><b>Blinded</b>: The target is no longer blinded.</li><li><b>Deafened</b>: The target is no longer deafened.</li><li><b>Paralyzed</b>: The target is no longer paralyzed.</li><li><b>Stunned</b>: The target is no longer stunned.</li></ul><br>These abilities are cumulative. For example, a 12th-level paladin's lay on hands ability heals 6d6 points of damage and might also cure Fatigued and Exhausted conditions as well as removing diseases and neutralizing poisons. Once a condition or spell effect is chosen, it can't be changed.",
    "choices": 1,
    "status": "incomplete",
    "selections": [],
    "options": [
    "fatigued",
    "shaken",
    "sickened"
],
    "formula": {
    "classes": {
        "paladin": {
            "special quality": [
                {
                    "name": "mercies"
        :
            [
                "{{0}}"
            ]
        }
        ]
        }
    }
},
    "level": 3
},
{
    "name": "Mercy (6th)",
    "type": "Su",
    "text": "At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin's lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin. A mercy can remove a condition caused by a curse, disease, or poison without curing the affliction. Such conditions return after 1 hour unless the mercy actually removes the affliction that causes the condition.\n\nAt 3rd level, the paladin can select from the following initial mercies.<ul><li><b>Fatigued</b>: The target is no longer fatigued.</li><li><b>Shaken</b>: The target is no longer shaken.</li><li><b>Sickened</b>: The target is no longer sickened.</li></ul>\nAt 6th level, a paladin adds the following mercies to the list of those that can be selected.<ul><li><b>Dazed</b>: The target is no longer dazed.</li><li><b>Diseased</b>: The paladin's lay on hands ability also acts as remove disease, using the paladin's level as the caster level.</li><li><b>Staggered</b>: The target is no longer staggered, unless the target is at exactly 0 hit points.</li></ul>At 9th level, a paladin adds the following mercies to the list of those that can be selected.\n<ul><li><b>Cursed</b>: The paladin's lay on hands ability also acts as remove curse, using the paladin's level as the caster level.</li><li><b>Exhausted</b>: The target is no longer exhausted. The paladin must have the fatigue mercy before selecting this mercy.Frightened: The target is no longer frightened. The paladin must have the shaken mercy before selecting this mercy.</li><li><b>Nauseated</b>: The target is no longer nauseated. The paladin must have the sickened mercy before selecting this mercy.</li><li><b>Poisoned</b>: The paladin's lay on hands ability also acts as neutralize poison, using the paladin's level as the caster level.\nAt 12th level, a paladin adds the following mercies to the list of those that can be selected.</li>\n<ul><li><b>Blinded</b>: The target is no longer blinded.</li><li><b>Deafened</b>: The target is no longer deafened.</li><li><b>Paralyzed</b>: The target is no longer paralyzed.</li><li><b>Stunned</b>: The target is no longer stunned.</li></ul>\nThese abilities are cumulative. For example, a 12th-level paladin's lay on hands ability heals 6d6 points of damage and might also cure Fatigued and Exhausted conditions as well as removing diseases and neutralizing poisons. Once a condition or spell effect is chosen, it can't be changed.",
    "choices": 1,
    "status": "incomplete",
    "selections": [],
    "options": [
    "fatigued",
    "shaken",
    "sickened",
    "dazed",
    "diseased",
    "staggered"
],
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "mercies": [
                    "{{0}}"
                ]
            }
        }
    }
},
    "level": 6,
    "hide": true
},
{
    "name": "Mercy (9th)",
    "type": "Su",
    "text": "At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin's lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin. A mercy can remove a condition caused by a curse, disease, or poison without curing the affliction. Such conditions return after 1 hour unless the mercy actually removes the affliction that causes the condition.\n\nAt 3rd level, the paladin can select from the following initial mercies.<ul><li><b>Fatigued</b>: The target is no longer fatigued.</li><li><b>Shaken</b>: The target is no longer shaken.</li><li><b>Sickened</b>: The target is no longer sickened.</li></ul>\nAt 6th level, a paladin adds the following mercies to the list of those that can be selected.<ul><li><b>Dazed</b>: The target is no longer dazed.</li><li><b>Diseased</b>: The paladin's lay on hands ability also acts as remove disease, using the paladin's level as the caster level.</li><li><b>Staggered</b>: The target is no longer staggered, unless the target is at exactly 0 hit points.</li></ul>At 9th level, a paladin adds the following mercies to the list of those that can be selected.\n<ul><li><b>Cursed</b>: The paladin's lay on hands ability also acts as remove curse, using the paladin's level as the caster level.</li><li><b>Exhausted</b>: The target is no longer exhausted. The paladin must have the fatigue mercy before selecting this mercy.Frightened: The target is no longer frightened. The paladin must have the shaken mercy before selecting this mercy.</li><li><b>Nauseated</b>: The target is no longer nauseated. The paladin must have the sickened mercy before selecting this mercy.</li><li><b>Poisoned</b>: The paladin's lay on hands ability also acts as neutralize poison, using the paladin's level as the caster level.\nAt 12th level, a paladin adds the following mercies to the list of those that can be selected.</li>\n<ul><li><b>Blinded</b>: The target is no longer blinded.</li><li><b>Deafened</b>: The target is no longer deafened.</li><li><b>Paralyzed</b>: The target is no longer paralyzed.</li><li><b>Stunned</b>: The target is no longer stunned.</li></ul>\nThese abilities are cumulative. For example, a 12th-level paladin's lay on hands ability heals 6d6 points of damage and might also cure Fatigued and Exhausted conditions as well as removing diseases and neutralizing poisons. Once a condition or spell effect is chosen, it can't be changed.",
    "choices": 1,
    "status": "incomplete",
    "selections": [],
    "options": [
    "fatigued",
    "shaken",
    "sickened",
    "dazed",
    "diseased",
    "staggered",
    "cursed",
    "exhausted",
    "frightened",
    "nauseated",
    "poisoned"
],
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "mercies": [
                    "{{0}}"
                ]
            }
        }
    }
},
    "level": 9,
    "hide": true
},
{
    "name": "Mercy (12th)",
    "type": "Su",
    "text": "At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin's lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin. A mercy can remove a condition caused by a curse, disease, or poison without curing the affliction. Such conditions return after 1 hour unless the mercy actually removes the affliction that causes the condition.\n\nAt 3rd level, the paladin can select from the following initial mercies.<ul><li><b>Fatigued</b>: The target is no longer fatigued.</li><li><b>Shaken</b>: The target is no longer shaken.</li><li><b>Sickened</b>: The target is no longer sickened.</li></ul>\nAt 6th level, a paladin adds the following mercies to the list of those that can be selected.<ul><li><b>Dazed</b>: The target is no longer dazed.</li><li><b>Diseased</b>: The paladin's lay on hands ability also acts as remove disease, using the paladin's level as the caster level.</li><li><b>Staggered</b>: The target is no longer staggered, unless the target is at exactly 0 hit points.</li></ul>At 9th level, a paladin adds the following mercies to the list of those that can be selected.\n<ul><li><b>Cursed</b>: The paladin's lay on hands ability also acts as remove curse, using the paladin's level as the caster level.</li><li><b>Exhausted</b>: The target is no longer exhausted. The paladin must have the fatigue mercy before selecting this mercy.Frightened: The target is no longer frightened. The paladin must have the shaken mercy before selecting this mercy.</li><li><b>Nauseated</b>: The target is no longer nauseated. The paladin must have the sickened mercy before selecting this mercy.</li><li><b>Poisoned</b>: The paladin's lay on hands ability also acts as neutralize poison, using the paladin's level as the caster level.\nAt 12th level, a paladin adds the following mercies to the list of those that can be selected.</li>\n<ul><li><b>Blinded</b>: The target is no longer blinded.</li><li><b>Deafened</b>: The target is no longer deafened.</li><li><b>Paralyzed</b>: The target is no longer paralyzed.</li><li><b>Stunned</b>: The target is no longer stunned.</li></ul>\nThese abilities are cumulative. For example, a 12th-level paladin's lay on hands ability heals 6d6 points of damage and might also cure Fatigued and Exhausted conditions as well as removing diseases and neutralizing poisons. Once a condition or spell effect is chosen, it can't be changed.",
    "choices": 1,
    "status": "incomplete",
    "selections": [],
    "options": [
    "fatigued",
    "shaken",
    "sickened",
    "dazed",
    "diseased",
    "staggered",
    "cursed",
    "exhausted",
    "frightened",
    "nauseated",
    "poisoned",
    "blinded",
    "deafened",
    "paralyzed",
    "stunned"
],
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "mercies": [
                    "{{0}}"
                ]
            }
        }
    }
},
    "level": 12,
    "hide": true
},
{
    "name": "Mercy (15th)",
    "type": "Su",
    "text": "At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin's lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin. A mercy can remove a condition caused by a curse, disease, or poison without curing the affliction. Such conditions return after 1 hour unless the mercy actually removes the affliction that causes the condition.\n\nAt 3rd level, the paladin can select from the following initial mercies.<ul><li><b>Fatigued</b>: The target is no longer fatigued.</li><li><b>Shaken</b>: The target is no longer shaken.</li><li><b>Sickened</b>: The target is no longer sickened.</li></ul>\nAt 6th level, a paladin adds the following mercies to the list of those that can be selected.<ul><li><b>Dazed</b>: The target is no longer dazed.</li><li><b>Diseased</b>: The paladin's lay on hands ability also acts as remove disease, using the paladin's level as the caster level.</li><li><b>Staggered</b>: The target is no longer staggered, unless the target is at exactly 0 hit points.</li></ul>At 9th level, a paladin adds the following mercies to the list of those that can be selected.\n<ul><li><b>Cursed</b>: The paladin's lay on hands ability also acts as remove curse, using the paladin's level as the caster level.</li><li><b>Exhausted</b>: The target is no longer exhausted. The paladin must have the fatigue mercy before selecting this mercy.Frightened: The target is no longer frightened. The paladin must have the shaken mercy before selecting this mercy.</li><li><b>Nauseated</b>: The target is no longer nauseated. The paladin must have the sickened mercy before selecting this mercy.</li><li><b>Poisoned</b>: The paladin's lay on hands ability also acts as neutralize poison, using the paladin's level as the caster level.\nAt 12th level, a paladin adds the following mercies to the list of those that can be selected.</li>\n<ul><li><b>Blinded</b>: The target is no longer blinded.</li><li><b>Deafened</b>: The target is no longer deafened.</li><li><b>Paralyzed</b>: The target is no longer paralyzed.</li><li><b>Stunned</b>: The target is no longer stunned.</li></ul>\nThese abilities are cumulative. For example, a 12th-level paladin's lay on hands ability heals 6d6 points of damage and might also cure Fatigued and Exhausted conditions as well as removing diseases and neutralizing poisons. Once a condition or spell effect is chosen, it can't be changed.",
    "choices": 1,
    "status": "incomplete",
    "selections": [],
    "options": [
    "fatigued",
    "shaken",
    "sickened",
    "dazed",
    "diseased",
    "staggered",
    "cursed",
    "exhausted",
    "frightened",
    "nauseated",
    "poisoned",
    "blinded",
    "deafened",
    "paralyzed",
    "stunned"
],
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "mercies": [
                    "{{0}}"
                ]
            }
        }
    }
},
    "level": 15,
    "hide": true
},
{
    "name": "Mercy (18th)",
    "type": "Su",
    "text": "At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin's lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin. A mercy can remove a condition caused by a curse, disease, or poison without curing the affliction. Such conditions return after 1 hour unless the mercy actually removes the affliction that causes the condition.\n\nAt 3rd level, the paladin can select from the following initial mercies.<ul><li><b>Fatigued</b>: The target is no longer fatigued.</li><li><b>Shaken</b>: The target is no longer shaken.</li><li><b>Sickened</b>: The target is no longer sickened.</li></ul>\nAt 6th level, a paladin adds the following mercies to the list of those that can be selected.<ul><li><b>Dazed</b>: The target is no longer dazed.</li><li><b>Diseased</b>: The paladin's lay on hands ability also acts as remove disease, using the paladin's level as the caster level.</li><li><b>Staggered</b>: The target is no longer staggered, unless the target is at exactly 0 hit points.</li></ul>At 9th level, a paladin adds the following mercies to the list of those that can be selected.\n<ul><li><b>Cursed</b>: The paladin's lay on hands ability also acts as remove curse, using the paladin's level as the caster level.</li><li><b>Exhausted</b>: The target is no longer exhausted. The paladin must have the fatigue mercy before selecting this mercy.Frightened: The target is no longer frightened. The paladin must have the shaken mercy before selecting this mercy.</li><li><b>Nauseated</b>: The target is no longer nauseated. The paladin must have the sickened mercy before selecting this mercy.</li><li><b>Poisoned</b>: The paladin's lay on hands ability also acts as neutralize poison, using the paladin's level as the caster level.\nAt 12th level, a paladin adds the following mercies to the list of those that can be selected.</li>\n<ul><li><b>Blinded</b>: The target is no longer blinded.</li><li><b>Deafened</b>: The target is no longer deafened.</li><li><b>Paralyzed</b>: The target is no longer paralyzed.</li><li><b>Stunned</b>: The target is no longer stunned.</li></ul>\nThese abilities are cumulative. For example, a 12th-level paladin's lay on hands ability heals 6d6 points of damage and might also cure Fatigued and Exhausted conditions as well as removing diseases and neutralizing poisons. Once a condition or spell effect is chosen, it can't be changed.",
    "choices": 1,
    "status": "incomplete",
    "selections": [],
    "options": [
    "fatigued",
    "shaken",
    "sickened",
    "dazed",
    "diseased",
    "staggered",
    "cursed",
    "exhausted",
    "frightened",
    "nauseated",
    "poisoned",
    "blinded",
    "deafened",
    "paralyzed",
    "stunned"
],
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "mercies": [
                    "{{0}}"
                ]
            }
        }
    }
},
    "level": 18,
    "hide": true
},
{
    "name": "Channel Positive Energy",
    "type": "Su",
    "text": "When a paladin reaches 4th level, she gains the supernatural ability to channel positive energy like a cleric. Using this ability consumes two uses of her lay on hands ability. A paladin uses her level as her effective cleric level when channeling positive energy. This is a Charisma-based ability.",
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "channel positive energy": {
                    "healing (x d6)": "ceil(classes[\"paladin\"].level/2)",
                        "save dc": "10 + floor(classes[\"paladin\"].level/2) + classes[\"paladin\"].level"
                }
            }
        }
    }
},
    "level": 4
},
{
    "name": "Spells (Paladin)",
    "type": "",
    "text": "Beginning at 4th level, a paladin gains the ability to cast a small number of divine spells which are drawn from the paladin spell list. A paladin must choose and prepare her spells in advance.\n\nTo prepare or cast a spell, a paladin must have a Charisma score equal to at least 10 + the spell level. The Difficulty Class for a saving throw against a paladin's spell is 10 + the spell level + the paladin's Charisma modifier.\n\nLike other spellcasters, a paladin can cast only a certain number of spells of each spell level per day. Her base daily spell allotment is given on Table: Paladin. In addition, she receives bonus spells per day if she has a high Charisma score (see Table: Ability Modifiers and Bonus Spells). When Table: Paladin indicates that the paladin gets 0 spells per day of a given spell level, she gains only the bonus spells she would be entitled to based on her Charisma score for that spell level.\n\nA paladin must spend 1 hour each day in quiet prayer and meditation to regain her daily allotment of spells. A paladin may prepare and cast any spell on the paladin spell list, provided that she can cast spells of that level, but she must choose which spells to prepare during her daily meditation.\n\nThrough 3rd level, a paladin has no caster level. At 4th level and higher, her caster level is equal to her paladin level – 3.",
    "formula": {
    "classes": {
        "paladin": {
            "features": {
                "spells": {
                    "caster level": "max( classes[\"paladin\"].level - 3, 0)",
                        "style": "prepared",
                        "type": "divine",
                        "max": 4,
                        "text": "Spells per Day",
                        "data": {
                        "1st": "ceil( (classes[\"paladin\"].level - 4) / 4)",
                            "2nd": "ceil( (classes[\"paladin\"].level - 7) / 4)",
                            "3rd": "ceil( (classes[\"paladin\"].level - 10) / 4)",
                            "4th": "ceil( (classes[\"paladin\"].level - 13) / 4)"
                    }
                }
            }
        }
    }
},
    "level": 4
},
{
    "name": "Divine Bond",
    "type": "Sp",
    "text": "Upon reaching 5th level, a paladin forms a divine bond with her god. This bond can take one of two forms. Once the form is chosen, it cannot be changed.\n\nThe first type of bond allows the paladin to enhance her weapon as a standard action by calling upon the aid of a celestial spirit for 1 minute per paladin level. When called, the spirit causes the weapon to shed light as a torch. At 5th level, this spirit grants the weapon a +1 enhancement bonus. For every three levels beyond 5th, the weapon gains another +1 enhancement bonus, to a maximum of +6 at 20th level. These bonuses can be added to the weapon, stacking with existing weapon bonuses to a maximum of +5, or they can be used to add any of the following weapon properties: axiomatic, brilliant energy, defending, disruption, flaming, flaming burst, holy, keen, merciful, and speed. Adding these properties consumes an amount of bonus equal to the property's cost (see Table: Melee Weapon Special Abilities). These bonuses are added to any properties the weapon already has, but duplicate abilities do not stack. If the weapon is not magical, at least a +1 enhancement bonus must be added before any other properties can be added. The bonus and properties granted by the spirit are determined when the spirit is called and cannot be changed until the spirit is called again. The celestial spirit imparts no bonuses if the weapon is held by anyone other than the paladin but resumes giving bonuses if returned to the paladin. These bonuses apply to only one end of a double weapon. A paladin can use this ability once per day at 5th level, and one additional time per day for every four levels beyond 5th, to a total of four times per day at 17th level.\n\nIf a weapon bonded with a celestial spirit is destroyed, the paladin loses the use of this ability for 30 days, or until she gains a level, whichever comes first. During this 30-day period, the paladin takes a –1 penalty on attack and weapon damage rolls.\n\nThe second type of bond allows a paladin to gain the service of an unusually intelligent, strong, and loyal steed to serve her in her crusade against evil. This mount is usually a heavy horse (for a Medium paladin) or a pony (for a Small paladin), although more exotic mounts, such as a boar, camel, or dog are also suitable. This mount functions as a druid's animal companion, using the paladin's level as her effective druid level. Bonded mounts have an Intelligence of at least 6.\n\nOnce per day, as a full-round action, a paladin may magically call her mount to her side. This ability is the equivalent of a spell of a level equal to one-third the paladin's level. The mount immediately appears adjacent to the paladin. A paladin can use this ability once per day at 5th level, and one additional time per day for every 4 levels thereafter, for a total of four times per day at 17th level.\n\nAt 11th level, the mount gains the celestial creature simple template and becomes a magical beast for the purposes of determining which spells affect it.\n\nAt 15th level, a paladin's mount gains spell resistance equal to the paladin's level + 11.\n\nShould the paladin's mount die, the paladin may not summon another mount for 30 days or until she gains a paladin level, whichever comes first. During this 30-day period, the paladin takes a –1 penalty on attack and weapon damage rolls.",
    "formula": {},
    "level": 5
},
{
    "name": "Aura of Resolve",
    "type": "Su",
    "text": "At 8th level, a paladin is immune to charm spells and spell-like abilities. Each ally within 10 feet of her gains a +4 morale bonus on saving throws against charm effects.\n\nThis ability functions only while the paladin is conscious, not if she is unconscious or dead.",
    "formula": {},
    "level": 8
},
{
    "name": "Aura of Justice",
    "type": "Su",
    "text": "At 11th level, a paladin can expend two uses of her smite evil ability to grant the ability to smite evil to all allies within 10 feet, using her bonuses. Allies must use this smite evil ability by the start of the paladin's next turn and the bonuses last for 1 minute. Using this ability is a free action. Evil creatures gain no benefit from this ability.",
    "formula": {},
    "level": 11
},
{
    "name": "Aura of Faith",
    "type": "Su",
    "text": "At 14th level, a paladin's weapons are treated as good-aligned for the purposes of overcoming Damage Reduction. Any attack made against an enemy within 10 feet of her is treated as good-aligned for the purposes of overcoming Damage Reduction.\n\nThis ability functions only while the paladin is conscious, not if she is unconscious or dead.",
    "formula": {},
    "level": 14
},
{
    "name": "Aura of Righteousness",
    "type": "Su",
    "text": "At 17th level, a paladin gains DR 5/evil and immunity to compulsion spells and spell-like abilities. Each ally within 10 feet of her gains a +4 morale bonus on saving throws against compulsion effects.\n\nThis ability functions only while the paladin is conscious, not if she is unconscious or dead.",
    "formula": {},
    "level": 17
},
{
    "name": "Holy Champion",
    "type": "Su",
    "text": "At 20th level, a paladin becomes a conduit for the power of her god. Her DR increases to 10/evil. Whenever she uses smite evil and successfully strikes an evil outsider, the outsider is also subject to a banishment, using her paladin level as the caster level (her weapon and holy symbol automatically count as objects that the subject hates). After the banishment effect and the damage from the attack is resolved, the smite immediately ends. In addition, whenever she channels positive energy or uses lay on hands to heal a creature, she heals the maximum possible amount.",
    "formula": {},
    "level": 20
},
{
    "name": "Divine Emissary",
    "type": "Ex",
    "text": "At 1st level, a chosen one gains an emissary familiar, treating her paladin level as her wizard level for the purpose of this ability.",
    "formula": {},
    "level": 1
},
{
    "name": "Religious Mentor",
    "type": "Ex",
    "text": "The familiar's sworn duty is to help train the chosen one for her future glory. The familiar is treated as having a number of ranks in Knowledge (religion) equal to the chosen one's paladin level. The chosen one doesn't gain Knowledge (religion) as a class skill.",
    "formula": {},
    "level": 1
},
{
    "name": "Delayed Grace",
    "type": "Su",
    "text": "A chosen one begins her adventuring career without fully understanding her true potential. The chosen one uses the barbarian, rogue, sorcerer column to calculate her typical starting age. She receives the smite evil ability at 2nd level and the divine grace ability at 4th level. This does not affect the rate at which she gains additional uses per day of smite evil, so she still gains her second use at 4th level, her third at 7th level, and so on.\n\nThis ability alters divine grace and smite evil.",
    "formula": {},
    "level": 2
},
{
    "name": "Lay on Paws",
    "type": "Su",
    "text": "At 2nd level, a chosen one's familiar is able to borrow some of her divine energy to heal itself and others. The familiar can use the chosen one's lay on hands ability, including all of her mercies, but each such use consumes two uses of the paladin's lay on hands ability. Starting at 4th level, the familiar can also channel positive energy, but each such use consumes four uses of the paladin's lay on hands ability.\n\nThis ability alters lay on hands and channel positive energy.",
    "formula": {},
    "level": 2
},
{
    "name": "True Form",
    "type": "Ex",
    "text": "At 7th level, a chosen one's familiar reveals its true form, transforming into an outsider improved familiar that matches the chosen one's patron's alignment (typically an arbiter, a cassisian, a harbinger, or a silvanshee, but potentially any lawful neutral, lawful good, or neutral good outsider familiar depending on the patron). The familiar gains the change shape universal monster ability if it doesn't already have it, which it can use at will to transform into its original form or back to its true form.",
    "formula": {},
    "level": 7
},
{
    "name": "Emissary's Smite",
    "type": "Su",
    "text": "At 11th level, a chosen one's familiar also benefits from the paladin's smite evil ability whenever the chosen one uses smite evil.",
    "formula": {},
    "level": 11
}
]